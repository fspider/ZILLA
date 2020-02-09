const uuid = require('uuid');
const db = require('_helpers/db');
const File = db.File;
const fs = require('fs');
var http = require('http');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: 'faxing@brsh.co',
        pass: 'mf3192CY'
    }
});

const { BitlyClient } = require('bitly');
const bitly = new BitlyClient('9fee3c68c996556bcf93597d118ea9c579332429', {});

module.exports = {
    getAllFiles,
    create,
    getFile,
    saveSigned,
    downloadFile
};

async function getAllFiles(params) {
    return await File.find({owner: params.owner});
}

async function getFile(params){
    let fileData = await File.find({id: params.file}),
        signedIndex = fileData[0].signers.findIndex(item => {
            return item.email == params.user;
        });
    
    console.log(fileData[0].signers[signedIndex].signed);

    if(!fileData[0].signers[signedIndex].signed){
        let discFile = fs.readFileSync(process.cwd() + '/saved-files/' + params.file + '.pdf')

        let file = {
            file: new Buffer(discFile).toString('base64'),
            data: fileData
        }
        
        return file;
    }else{
        return false;
    }
}

async function downloadFile(params){
    let fileData = await File.find({id: params.id}),
        discFile = fs.readFileSync(process.cwd() + '/saved-files/' + params.id + '.pdf')

    let file = {
        file: new Buffer(discFile).toString('base64'),
        name: fileData[0].name
    }

    return file;
}

async function saveSigned(fileParam) {
    let base64String = "data:application/pdf;base64, " + fileParam.file,
        base64File = base64String.split(';base64,').pop(),
        path = process.cwd() + '/saved-files',
        signer = fileParam.params.signer;

    fs.mkdirSync(path, {recursive: true}, (err) => {
        if(err){
            console.log(err);
        }
    });

    fs.writeFile(path + '/' + fileParam.params.fileName + '.pdf', base64File, 'base64', (err) => {
        console.log('saved');
        if(err){
            console.log(err);
        }
    });

    const currentFile = await File.find({id: fileParam.params.fileName});

    let fileProps = currentFile[0];

    let signedIndex = fileProps.signers.findIndex(item => {
            
        return item.email == signer
    });
    
    fileProps.signers[signedIndex].signed = true;

    await File.updateOne({id: fileProps.id}, {$set: {signers: fileProps.signers}});
}

async function create(fileParam, url) {
    let id = uuid.v4();

    if (await File.findOne({ id: id })) {
        create(fileParam);
    }

    const file = new File(fileParam.params);

    file.id = id;

    let base64String = "data:application/pdf;base64, " + fileParam.file,
        base64File = base64String.split(';base64,').pop(),
        path = process.cwd() + '/saved-files',
        signers = fileParam.params.signers,
        urls = [];

    if(signers.length){
        signers.map(item => {

            let params = "email=" + item.email + "&" + "fileId=" + id,
                formatedParams = Buffer.from(params).toString('base64'),
                base64Url = url + formatedParams;
            
            item.url = base64Url;
            console.log(params, url);
            if(!urls.includes(item)){
                urls.push(item);
            }
        });

        urls.map(item => {
            sendMail(item);
        })
    }

    fs.mkdirSync(path, {recursive: true}, (err) => {
        if(err){
            console.log(err);
        }
    });

    fs.writeFile(path + '/' + id + '.pdf', base64File, 'base64', (err) => {
        console.log('saved');
        if(err){
            console.log(err);
        }
    });
    
    await file.save();
}
async function getFormatedLInk(url) {
    let result;
    try {
        result = await bitly.shorten(url);
    } catch (e) {
        throw e;
    }

    return Promise.resolve(result);
}

async function sendMail(item){
    getFormatedLInk(item.url).then((url) => {
        transporter.sendMail({
            from: 'DocSigner <doc.signer@gmail.com>',
            to: item.email,
            subject: 'Sign Document',
            text: 'Hi, ' + item.name + " you have recived the document to sign. <br/> Open this link to sign: " + url.url
        });
        
        console.log('sended mail');

        if(item.phone){
            http.get('http://sms.cellcom.co.il/scripts/smsgate.asp?Username=LEV&Password=LEVSMS&Target=' + item.phone +"&Source=0522199451&Message=Your link " + url.url + "&Validity=1&Replace=1&Immediate=True", (resp) => {
                
            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        }
    });
}

const express = require('express');
const router = express.Router();
const fileService = require('./file.service');

// routes
router.post('/save', createFile);
router.post('/get', getFile);
router.post('/signed', saveSignedFile);
router.post('/get-files', getAllFiles);
router.post('/download-file', downloadFile);

module.exports = router;

function createFile(req, res, next) {
    let fullUrl = req.protocol + '://' + req.hostname + ":8090/#/sign?";

    fileService.create(req.body, fullUrl)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function saveSignedFile(req, res, next) {
    fileService.saveSigned(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getFile(req, res, next) {
    fileService.getFile(req.body)
        .then(file => res.json(file))
        .catch(err => next(err));
}

function downloadFile(req, res, next) {
    fileService.downloadFile(req.body)
        .then(file => res.json(file))
        .catch(err => next(err));
}

function getAllFiles(req, res, next) {
    fileService.getAllFiles(req.body)
        .then(file => res.json(file))
        .catch(err => next(err));
}
<template>
  	<v-layout align-center fill-height class="pdf-layout">
		
        <v-toolbar app fixed color="secondary" dark >
            <p class="title mb-0"> {{elementsCounter - elementsToRender.length}} of {{elementsCounter}}</p>

			<v-spacer></v-spacer>

			<v-toolbar-items>
				<v-btn :disabled="!!elementsToRender.length" flat @click.stop="sendFile">Accept</v-btn>
			</v-toolbar-items>

		</v-toolbar>


		<div v-if="file" class="pdf-wrapper">
			<div class="pdf-container" id="pdfContainer">
				<pdf @src="file" style="width: 100%; height: 100%;" v-for="i in numPages" :key="i" :id="i" :src="file" :rotate="0" :page="i"></pdf>
			</div>
		</div>

		<div v-if="processing" class="progress">
			<v-progress-circular indeterminate color="primary"></v-progress-circular>
		</div>

        <v-dialog v-model="openPlaceSign" width="500">
			<v-card>
				<v-card-title class="headline grey lighten-2" primary-title>
					Signature
				</v-card-title>
					
				<v-card-text class="sign-canvas">
					<input type="color"  class="js-color-picker  color-picker">
					<input type="range" class="js-line-range" min="1" max="72" value="1">
					<label class="js-range-value">1</label>Px
					<canvas class="js-paint paint-canvas" ref="canvas" width="300" height="300"></canvas>
				</v-card-text>

				<v-card-actions>
					<v-btn flat color="grey" @click="cancelTool()">Cancel</v-btn>
					<v-btn flat color="grey" @click="clearCanvas()">Clear</v-btn>
					<v-spacer></v-spacer>
					<v-btn flat color="orange" @click="accept">Accept</v-btn>
				</v-card-actions>
			</v-card>
        </v-dialog>
	</v-layout>
</template>

<script>
	import pdfLib from 'pdf-lib';
	import pdf from 'vue-pdf';
	import { PDFDocument, PDFDict, PDFName, PDFRef, StandardFonts, rgb, degrees } from 'pdf-lib';

    import { register } from '../../api/common';
    
	import LegendBar from "../../components/LegendBar";

	import interact from 'interactjs';
	import fontkit from '@pdf-lib/fontkit';

	export default {
		name: "Sign",
		
		components: { pdf, LegendBar },
        
        mounted(){
            let url = window.location.href,
                urlParams = url.split('?').pop().replace('%3D', ''),
                formatedParams = Buffer.from(urlParams, 'base64').toString('ascii'),
                splitedParams = formatedParams.split('&'),
                email = splitedParams[0].split('=').pop(),
                fileId = splitedParams[1].split('=').pop();
            
            this.fileName = fileId;
            this.signer = email;
            this.getFile(email, fileId);
        },

		data() {
			return {
				mini: true,
                drawer: true,
				page: 0,
				numPages: 0,
				file: null,
				fileBase64: '',
				signText: '',
				signImage: '',
				coords: {},
				pdfElementsCounter: 0,
				docElements: [],
				notAcceptedElement: false,
                processing: true,
                elementsToRender: [],
                openPlaceSign: false,
                elementsCounter: 0
			}
		},

		methods: {
            getFile(email, fileId){
                

				let params = {
                    user: email,
                    file: fileId
				}

				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(params)
				};
				let url = window.location.protocol + '//' + window.location.hostname + ':4000/file/get';
				return fetch(url, requestOptions).then(res => {
                    res.json().then(file => {
                        let formatedFile = "data:application/pdf;base64, " + file.file;
                        this.udpateFile(formatedFile);
                        
                        let elements = [];

                        file.data[0].elements.map(item => {
                            if(item.type == "signPlace"){
                                if(item.data.signEmail == this.signer){
                                    elements.push(item);
                                }
                            }
                        });

                        this.elementsToRender = elements;
                        this.elementsCounter = elements.length;
                    })
				});
            },

            renderElements(){
				let pdfContainer = document.getElementById('pdfContainer'),
					containerSizes = pdfContainer.getBoundingClientRect();
				
                this.elementsToRender.map((item, key) => {
                    let formatedX = (item.x * containerSizes.width) / 100,
					formatedY = ((item.y * containerSizes.height) / 100);
					console.log(item.x, item.y, containerSizes.width, pdfContainer.offsetHeight);
                    if(item.type == "signPlace"){
                        let container = document.createElement('div'),
                            content = "<div class='sign-at-place'><p>Click&Sign</p><p class='signer-name'>"+ item.data.signName +"</p></div>";
                        
                        container.classList.add("click-place");
                        container.setAttribute("style", "top: " + formatedY + "px; left: " + formatedX + "px;");
                        container.innerHTML = content;

                        container.addEventListener('click', (e) => {
                            this.openDraw(key);
                            this.drawX = formatedX;
                            this.drawY = formatedY;
                        });

                        document.getElementById('pdfContainer').appendChild(container);
                    }
                });
            },

            sendFile(){
                let file = {
					params: {
                        signer: this.signer,
                        fileName: this.fileName
                    }
                }
                
                if(typeof this.fileBase64 == 'string' ){
					file.file = this.fileBase64;
				}else{
					file.file = this.arrayBufferToBase64(this.fileBase64);
                }
                
                const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(file)
				};
				let url = window.location.protocol + '//' + window.location.hostname + ':4000/file/signed';
				return fetch(url, requestOptions).then((res)=>{
					console.log(res);
					if(res.status == 200){
						console.log(res.status);
					}
				});
            },

            openDraw(key){
                this.selectedSignPlace = key;
                this.openPlaceSign = true;
                this.initCanvas();
            },

			udpateFile(file){
				if(typeof file == 'string'){
                    let self = this,
                        base64file = file.replace('data:application/pdf;base64, ', '')

                    self.fileBase64 = base64file;
					this.file = pdf.createLoadingTask(file);
					this.file.then(pdf => {
                        self.numPages = pdf.numPages;
						
						setTimeout(()=>{
							self.renderElements();
						}, 300);
                    });
				}else{
					let reader = new FileReader(),
					self = this;

					reader.onload = async function(e){
						self.file = pdf.createLoadingTask(e.target.result);
						self.fileBase64 = e.target.result;
						self.file.then(pdf => {
                            self.numPages = pdf.numPages;
							
							setTimeout(()=>{
								self.renderElements();
							}, 300);
						});
					};
					reader.readAsDataURL(file);
				}
				
                this.processing = false;
			},

			async applySign(data, x, y, width, height){
				const pdfDoc = await PDFDocument.load(this.fileBase64);
				const pages = pdfDoc.getPages();
				
				let pdfContainer = document.getElementById('pdfContainer'),
					containerSizes = pdfContainer.getBoundingClientRect(),
					pagesNumb = this.numPages,
					pageHeight = containerSizes.height / pagesNumb,
					currentPageNumber = Math.floor(y / pageHeight),
					currentPage = pages[currentPageNumber],
					scale = currentPage.getSize().width / containerSizes.width,
					formatedImage = '',
					imageByteArray = this.convertDataURIToBinary(data);

				if (data.includes('jpeg') || data.includes('jpg')){
					formatedImage = await pdfDoc.embedJpg(imageByteArray);
				} else if (data.includes('png')){
                    formatedImage = await pdfDoc.embedPng(imageByteArray);
				}

				if(y > pageHeight){
					y = y % pageHeight;
				}
				
				let scaledX = x * scale,
					scaledY = (currentPage.getSize().height - (y + height) * scale),
					scaledWidth = width * scale,
					scaledHeight = height * scale;

				currentPage.drawImage(formatedImage, {
					x: scaledX,
					y: scaledY,
					width: scaledWidth,
					height: scaledHeight,
				});

				const pdfBytes = await pdfDoc.save();
				let formatedPdf = "data:application/pdf;base64, " + this.arrayBufferToBase64(pdfBytes);

				this.fileBase64 = pdfBytes;
				this.udpateFile(formatedPdf);
			},

			convertDataURIToBinary(dataURI) {
				var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
				var base64 = dataURI.substring(base64Index);
				var raw = window.atob(base64);
				var rawLength = raw.length;
				var array = new Uint8Array(new ArrayBuffer(rawLength));

				for(let i = 0; i < rawLength; i++) {
					array[i] = raw.charCodeAt(i);
				}

				return array;
			},

			arrayBufferToBase64(buffer) {
				let binary = '';
				let bytes = new Uint8Array(buffer);
				let len = bytes.byteLength;
				for (let i = 0; i < len; i++) {
					binary += String.fromCharCode(bytes[i]);
				}
				return window.btoa(binary);
            },
            
            clearCanvas(){
				let paintCanvas = document.querySelector( '.js-paint' ),
					context = paintCanvas.getContext( '2d' );
				
				context.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
			},

			accept(){
				let paintCanvas = document.querySelector( '.js-paint' );
                this.signImage = paintCanvas.toDataURL();

                let sizes = paintCanvas.getBoundingClientRect();
                
                this.elementsToRender.splice(this.selectedSignPlace, 1);
                
                document.querySelectorAll(".click-place").forEach(e => e.parentNode.removeChild(e));

                this.cancelTool();
                console.log(this.drawX, this.drawY, sizes);
                this.applySign(this.signImage, this.drawX, this.drawY, sizes.width / 2, sizes.height / 2);
			},

			cancelTool(){
				this.openPlaceSign = false;

				this.clearCanvas();
			},

			initCanvas(){
				const paintCanvas = document.querySelector( '.js-paint' );
				const context = paintCanvas.getContext( '2d' );
				context.lineCap = 'round';

				const colorPicker = document.querySelector( '.js-color-picker');

				colorPicker.addEventListener( 'change', event => {
					context.strokeStyle = event.target.value; 
				} );

				const lineWidthRange = document.querySelector( '.js-line-range' );
				const lineWidthLabel = document.querySelector( '.js-range-value' );

				lineWidthRange.addEventListener( 'input', event => {
					const width = event.target.value;
					lineWidthLabel.innerHTML = width;
					context.lineWidth = width;
				} );

				let x = 0, y = 0;
				let isMouseDown = false;

				const stopDrawing = () => { isMouseDown = false; }
				const startDrawing = event => {
					isMouseDown = true;   
					[x, y] = [event.offsetX, event.offsetY];  
				}
				const drawLine = event => {
					if ( isMouseDown ) {
						const newX = event.offsetX;
						const newY = event.offsetY;
						context.beginPath();
						context.moveTo( x, y );
						context.lineTo( newX, newY );
						context.stroke();
						//[x, y] = [newX, newY];
						x = newX;
						y = newY;
					}
				}

				const stopDrawingMobile = () => { isMouseDown = false; }

				const startDrawingMobile = event => {
					
					isMouseDown = true;   
					[x, y] = getMousePos(event);
				}
				
				const drawLineMobile = event => {
					
					if ( isMouseDown ) {
						let position = getMousePos(event);
						const newX = position[0];
						const newY = position[1];
						context.beginPath();
						context.moveTo( x, y );
						context.lineTo( newX, newY );
						context.stroke();
						//[x, y] = [newX, newY];
						x = newX;
						y = newY;
					}
				}

				function getMousePos(touchEvent) {
					let canvas = document.querySelector( '.js-paint' ),
						rect = canvas.getBoundingClientRect();

					console.log(touchEvent.touches[0].clientX - rect.left)
					return [
						touchEvent.touches[0].clientX - rect.left,
						touchEvent.touches[0].clientY - rect.top
					];
				}

				paintCanvas.addEventListener( 'mousedown', startDrawing );
				paintCanvas.addEventListener( 'mousemove', drawLine );
				paintCanvas.addEventListener( 'mouseup', stopDrawing );
				paintCanvas.addEventListener( 'mouseout', stopDrawing );

				paintCanvas.addEventListener( 'touchstart', startDrawingMobile );
				paintCanvas.addEventListener( 'touchmove', drawLineMobile );
				paintCanvas.addEventListener( 'touchend', stopDrawingMobile );
				paintCanvas.addEventListener( 'touchcancel', stopDrawingMobile );
			}
		}
	};
</script>

<style>
    .click-place{
        display: inline-block;
        position: absolute;
    }

    .mb-0{
        margin-bottom: 0;
    }
</style>
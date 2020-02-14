<template>
  	<v-layout align-center fill-height class="pdf-layout">
		<ToolBar v-if="file" v-on:acceptTool="toolAccepted" :accepted="notAcceptedElement" ref="tools" />
		<div v-if="!legendNav" class="send-container mobile">
			<v-btn v-if="docElements.length" @click="sendDocument()">Send</v-btn>
		</div>

		<form v-if="!file" class="file-form">
			<input type="file" @change="getFile" id="loader" accept=".pdf">
			
			<div class="drag-place">
				<v-icon x-large>cloud_upload</v-icon>
				<p class="subtitle-2">Drag and drop or click to upload a file</p>
			</div>
		</form>
		
		<div v-if="file" class="pdf-wrapper">
			<div class="pdf-container" id="pdfContainer">
				<pdf @src="file" style="width: 100%; height: 100%;" v-for="i in numPages" :key="i" :id="i" :src="file" :rotate="0" :page="i"></pdf>
			</div>
		</div>

		<LegendBar v-if="file && legendNav" v-on:chooseAction="actionChoosed" v-on:updateData="updateElements" v-on:sendDocument="sendDocument" :data="docElements" />

		<div v-if="processing" class="progress">
			<v-progress-circular indeterminate color="primary"></v-progress-circular>
		</div>

		<v-snackbar v-model="snackbar">
			{{snackbarText}}
			<v-btn color="pink" flat @click="snackbar = false">
				Close
			</v-btn>
		</v-snackbar>
	</v-layout>
</template>

<script>
	import pdfLib from 'pdf-lib';
	import pdf from 'vue-pdf';
	import { PDFDocument, PDFDict, PDFName, PDFRef, StandardFonts, rgb, degrees } from 'pdf-lib';

	import { register } from '../../api/common';

	import ToolBar from "../../components/ToolBar";
	import LegendBar from "../../components/LegendBar";

	import interact from 'interactjs';
	import fontkit from '@pdf-lib/fontkit';

	export default {
		name: "Home",
		
		components: { pdf, ToolBar, LegendBar },
		
		mounted() {
			window.addEventListener("resize", this.onResize);

			this.widthWatcher();
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
				processing: false,
				legendNav: true,
				snackbar: false,
				snackbarText: ''
			}
		},

		methods: {
			widthWatcher(){
				if(window.innerWidth - 17 < 768){
					this.legendNav = false;
				}else{
					this.legendNav = true;
				}
			},

			onResize() {
				this.widthWatcher();
			},

			getFile(e){
				let file = e.target.files[0];

				this.fileName = file.name;
				this.udpateFile(file);
			},

			updateElements(data){
				if(data.type == 'text'){
					let elements = document.getElementsByClassName('draged-element'),
						elementInput = elements[elements.length - 1].getElementsByTagName('input');

					elementInput[0].setAttribute('value', data.data)
				}

				if(data.type != 'text'){
					let elements = document.getElementsByClassName('draged-element'),
						index = data.index - elements[elements.length];

					index >= 0 ? index : index = 0;

					elementInput = elements[index];

					console.log(elementInput);
				}
			},

			udpateFile(file){
				if(typeof file == 'string'){
					let self = this;

					this.file = pdf.createLoadingTask(file);
					this.file.then(pdf => {
						self.numPages = pdf.numPages;
					});
				}else{
					let reader = new FileReader(),
					self = this;

					reader.onload = function(e){
						self.file = pdf.createLoadingTask(e.target.result);
						self.fileBase64 = e.target.result;
						self.file.then(pdf => {
							self.numPages = pdf.numPages;
						});
					};
					reader.readAsDataURL(file);
				}
				
				this.processing = false;
			},

			actionChoosed(key){
				window.scroll({
					top: this.docElements[key].y,
					behavior: 'smooth'
				});

			},

			toolAccepted(data){
				this.docElements.push(data);
				this.notAcceptedElement = true;

				let key = this.docElements.length - 1;

				let container = document.createElement('div'),
					actions = "<div class='sign-element-actions'><span class='accept'><i aria-hidden='true' class='v-icon material-icons theme--light' style='color: rgb(117, 117, 117); caret-color: rgb(117, 117, 117);'>check</i></span><span class='remove'><i aria-hidden='true' class='v-icon material-icons theme--light' style='color: rgb(117, 117, 117); caret-color: rgb(117, 117, 117);'>cancel</i></span></div>",
					content = "",
					rezisable = false;
				
				if(data.type == 'sign' || data.type == 'image'){
					content = "<img class='draged-image' src='"+ data.data +"'/>";
					rezisable = true;
				}

				if(data.type == "signPlace"){
					rezisable = true;
					actions = "";
					content = "<div class='sign-at-place'><p>Click&Sign</p><p class='signer-name'>"+ data.data.signName +"</p></div>";
					container.classList.add("no-pt");
					this.notAcceptedElement = false;
				}

				if(data.type == "text"){
					content = "<input type='text' class='sign-text' disabled value='"+ data.data +"' style='font-size:" +  data.size + "px;'>";
				}

				container.classList.add("draged-element");
				container.classList.add("selected-element");
				console.log(window.scrollY);
				container.style.transform = `translate(0px, ${window.scrollY}px)`;
				container.innerHTML = content + actions + "<div class='resize-btn'><i aria-hidden='true' class='v-icon material-icons theme--light' style='color: rgb(117, 117, 117); caret-color: rgb(117, 117, 117);'>arrow_forward_ios</i></div>";

				let removeBtn = container.querySelector('.remove'),
					drawBtn = container.querySelector('.accept');

				if(removeBtn){
					removeBtn.addEventListener('click', (e) => {
						this.removeElement(key);
					});
				}
				
				if(drawBtn){
					drawBtn.addEventListener('click', (e) => {
						this.processing = true;
						
						if(data.type == "text"){
							let sizes = container.getBoundingClientRect();
							this.applyText(this.docElements[key].data, this.docElements[key].x, this.docElements[key].y, sizes.height, this.docElements[key].size);
						}else{
							let pdfContainer = document.getElementById('pdfContainer'),
								sizes = container.getBoundingClientRect(),
								containerSizes = pdfContainer.getBoundingClientRect(),
								formatedWidth = (sizes.width * 100) / containerSizes.width,
								formatedHeight = (sizes.height * 100) / containerSizes.height;
							
							this.applySign(this.docElements[key].data, this.docElements[key].x, this.docElements[key].y, formatedWidth, formatedHeight);
						}
						
						this.removeElement(key);
					});
				}

				document.getElementById('pdfContainer').appendChild(container);

				this.addInteractive(container, rezisable, this.docElements.length - 1);
			},

			removeElement(key){
				let elements = document.querySelectorAll('.draged-element');
					
				this.notAcceptedElement = false;

				elements[elements.length - 1].remove();
			},

			addInteractive(container, rezisable, key){
				let currentPositionY = parseInt(container.style.transform.split(',').pop()),
					position = { x: 0, y: currentPositionY },
					self = this,
					pdfContainer = document.getElementById('pdfContainer'),
					containerSizes = pdfContainer.getBoundingClientRect();
				
				interact(container).draggable({
					modifiers: [
						interact.modifiers.restrictRect({
							restriction: 'parent',
							endOnly: true
						})
					],
					listeners: {
						move (event) {
							position.x += event.dx;
							position.y += event.dy;
							console.log(position.y);
							self.docElements[key].x = (position.x * 100) / containerSizes.width;
							self.docElements[key].y = (position.y * 100) / containerSizes.height;

							event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
						},
					}
				});
				
				if(rezisable){
					interact(container).resizable({
						edges: { left: true, right: true, bottom: true, top: true },
						modifiers: [
							interact.modifiers.restrictEdges({
								outer: 'parent'
							}),

							interact.modifiers.restrictSize({
								min: { width: 100, height: 50 }
							})
						]
					}).on('resizemove', function (event) {
						var target = event.target;

						target.style.width = event.rect.width + 'px';
						target.style.height = event.rect.height + 'px';

						self.docElements[key].width = (event.rect.width * 100) / containerSizes.width;
						self.docElements[key].height = (event.rect.height * 100) / containerSizes.height;
					});
				}
			},

			sendDocument(){
				let user = JSON.parse(localStorage.user),
					elements = [],
					signers = [];

				let signIndex = this.docElements.findIndex(item => {
					return item.type == "signPlace";
				});

				if(signIndex != -1){
					this.docElements.map(item => {
						if(item.type != "signPlace"){
							item.data = '';
						}else{
							let currentSigner = signers.find( currentItem => currentItem.email == item.data.signEmail);
							if(!currentSigner){
								signers.push({
									name: item.data.signName,
									email: item.data.signEmail,
									phone: item.data.signPhone,
									signed: false
								});
							}
						}

						elements.push(item);
					});

					let file = {
						params: {
							name: this.fileName,
							owner: user.username,
							elements: elements,
							signers: signers
						}
					}
					
					if(typeof this.fileBase64 == 'string' ){
						file.file = this.fileBase64;
					}else{
						file.file = this.arrayBufferToBase64(this.fileBase64);
					}

					console.log(file)

					const requestOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + user.token },
						body: JSON.stringify(file)
					};
					let url = window.location.protocol + '//' + window.location.hostname + ':4000/file/save';
					console.log('url ' + url)
					return fetch(url, requestOptions).then((res)=>{
						console.log(res);
						if(res.status == 200){
							this.snackbar = true;
							this.snackbarText = 'Document was successfully saved and sent';
							this.page = 0,
							this.numPages = 0,
							this.file = null,
							this.fileBase64 = '',
							this.signText = '',
							this.signImage = '',
							this.coords = {},
							this.pdfElementsCounter = 0,
							this.docElements = [],
							this.notAcceptedElement = false,
							this.processing = false,
							this.legendNav = true;
						}
					});
				}else{
					this.snackbar = true;
					this.snackbarText = 'Please, set person to sign the document';
				}
				
			},

			async applySign(data, x, y, width, height){
				console.log(x, y, width, height);
				const pdfDoc = await PDFDocument.load(this.fileBase64);console.log(pdfDoc);
				const pages = pdfDoc.getPages();
				
				let pdfContainer = document.getElementById('pdfContainer'),
					containerSizes = pdfContainer.getBoundingClientRect(),
					pagesNumb = this.numPages,
					pageHeight = containerSizes.height / pagesNumb,
					formatedX = (x * containerSizes.width) / 100,
					formatedY = ((y * containerSizes.height) / 100),
					formatedWidth = (width * containerSizes.width) / 100,
					formatedHeight = ((height * containerSizes.height) / 100),
					currentPageNumber = Math.floor(formatedY / pageHeight),
					currentPage = pages[currentPageNumber],
					scale = currentPage.getSize().width / containerSizes.width,
					formatedImage = '',
					imageByteArray = this.convertDataURIToBinary(data);

				if (data.includes('jpeg') || data.includes('jpg')){
					console.log('1');
					formatedImage = await pdfDoc.embedJpg(imageByteArray);
					console.log('success');
				} else if (data.includes('png')){
					console.log('2');
					formatedImage = await pdfDoc.embedPng(imageByteArray);
					console.log('success');
				}

				if(formatedY > pageHeight){
					formatedY = formatedY % pageHeight;
				}
				console.log(formatedWidth, formatedHeight);
				let scaledX = formatedX * scale,
					scaledY = (currentPage.getSize().height - (formatedY + formatedHeight) * scale),
					scaledWidth = formatedWidth * scale,
					scaledHeight = formatedHeight * scale;
				
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

			async applyText(data, x, y, height, size){
				const pdfDoc = await PDFDocument.load(this.fileBase64);
				const pages = pdfDoc.getPages();
				
				pdfDoc.registerFontkit(fontkit)
				let font = await pdfDoc.embedFont(StandardFonts.TimesRoman)

				let pdfContainer = document.getElementById('pdfContainer'),
					containerSizes = pdfContainer.getBoundingClientRect(),
					pagesNumb = this.numPages,
					formatedX = (x * containerSizes.width) / 100,
					formatedY = ((y * containerSizes.height) / 100),
					pageHeight = containerSizes.height / pagesNumb,
					currentPageNumber = Math.floor(formatedY / pageHeight),
					currentPage = pages[currentPageNumber],
					scale = currentPage.getSize().width / containerSizes.width;
				formatedY -= parseInt(size) * 0.4;

				// console.log('x, y, height, size', x, y, height, size);
				// console.log('fx, fy, pageHeight, scale', formatedX, formatedY, pageHeight, scale);

				if(formatedY > pageHeight){
					formatedY = formatedY % pageHeight;
				}
				
				let scaledX = (formatedX + 6) * scale,
					scaledY = (currentPage.getSize().height - (formatedY + height) * scale);

				// console.log('scaledX, scaledY', scaledX, scaledY, formatedY);

				const openSansUrls = {
					partial:
						'OpenSans-Regular.ttf',
					full:
						'/SourceHanSerifK-Bold.otf',
				};

				const fontBytes = await fetch(openSansUrls.partial).then((res) => res.arrayBuffer())
				const customFont = await pdfDoc.embedFont(fontBytes)
				// const supportedCharacters = customFont
				// 	.getCharacterSet()
				// 	.map((codePoint) => String.fromCodePoint(codePoint))
				// 	.join('');
				// console.log(`Characters supported by font: ${supportedCharacters}\n`);

				currentPage.drawText(data, {
					x: scaledX,
					y: scaledY,
					size: parseInt(size) * 0.625,
					font: customFont,
					color: rgb(0, 0, 0),
					rotate: degrees(0),
				});
				console.log("drawText Completed")

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
			}
		}
	};
</script>

<style>
	.file-form{
		position: relative;
		display: flex;
		width: 50%;
		min-width: 300px;
		height: 33vh;
		margin: 0 auto;
		padding: 10px;
		text-align: center;
		justify-content: center;
		flex-direction: column;
		box-shadow: 0 0 7px 3px rgba(0, 0, 0, .3);
	}

	.file-form input{
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		font-size: 0;
		opacity: 0;
		cursor: pointer;
	}

	.pdf-container{
		position: relative;
	}

	.pdf-wrapper{
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 50px 30px 25px;
	}

	.pdf-layout{
		position: raltive;
	}

	.sign-canvas{
		text-align: center;
	}

	.sign-canvas canvas{
		background-color: #fafafa;
		border: 1px solid #757575;
	}

	.draged-element{
		max-width: 500px;
		position: absolute;
		left: 0;
		top: 0;
		touch-action: none;
		user-select: none;
		font-size: 0;
		-webkit-transform: translate(0px, 0px);
          transform: translate(0px, 0px);
	}
	
	.sign-at-place{
		position: relative;
		padding: 10px 30px;
		display: flex;
		justify-content: center;
		height: 100%;
		flex-direction: column;
    	width: 100%;
		text-align: center;
		background-color: rgba(0, 0, 0, .7);
		color: #fff;
		z-index: 100;
	}

	.sign-at-place p {
		font-size: 16px;
	}

	.signer-name{
		margin-bottom: 0;
		font-size: 18px;
	}

	.sign-text{
		margin-top: 27px;
		padding: 0 7px;
		font-size: 18px;
		border-bottom: 1px solid #757575;
	}
	
	.sign-element-actions{
		display: none;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 26px;
		background-color: rgba(0, 0, 0, .8);
		z-index: 1000;
	}

	.sign-element-actions .v-icon{
		font-size: 20px;
		color: #fff!important;
	}
	
	.selected-element{
		background-color: rgba(0, 0, 0, .1);
	}

	.no-pt{
		width: 165px;
		height: 85px;
		padding-top: 0;
	}

	.selected-element .sign-element-actions{
		display: block;
	}

	.resize-btn{
		display: none;
		position: absolute;
		right: -11px;
    	bottom: -11px;
		transform: rotate(45deg);
		cursor: pointer;
	}

	.selected-element .resize-btn{
		display: block;
	}

	.sign-element-actions .remove{
		position: absolute;
		top: 2px;
		right: 10px;
		cursor: pointer;
	}

	.sign-element-actions .accept{
		position: absolute;
		top: 2px;
		left: 10px;
		cursor: pointer;
	}

	.sign-image{
		max-width: 468px;
	}

	.draged-image{
		width: 100%;
		height: 100%;
	}

	.progress{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .3);
	}

	.progress .v-progress-circular{
		position: absolute;
		top: calc(50% - 16px);
		left: calc(50% - 16px);
	}

	.send-container.mobile{
		position: absolute;
		top: 25px;
		left: 50%;
		transform: translateX(-50%);
	}

	@media(max-width: 768px){
		.sign-image-uploaded {
			max-width: 300px;
		}

		.pdf-wrapper{
			padding: 80px 10px 25px;
		}
	}
</style>
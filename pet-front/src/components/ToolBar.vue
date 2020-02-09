<template>
	<div class="tools">
		<v-btn icon @click="setActiveTool(1)">
			<v-icon :color="activeTool == 1 ? 'primary' : '#757575'">edit</v-icon>
		</v-btn>
		<v-btn icon @click="setActiveTool(2)">
			<v-icon :color="activeTool == 2 ? 'primary' : '#757575'">email</v-icon>
		</v-btn>
		<v-btn icon @click="setActiveTool(3)">
			<v-icon :color="activeTool == 3 ? 'primary' : '#757575'">text_fields</v-icon>
		</v-btn>
		<v-btn icon @click="setActiveTool(4)">
			<v-icon :color="activeTool == 4 ? 'primary' : '#757575'">add_photo_alternate</v-icon>
		</v-btn>
		<v-btn icon @click="setActiveTool(5)">
			<v-icon :color="activeTool == 5 ? 'primary' : '#757575'">check</v-icon>
		</v-btn>

		<v-dialog v-model="openToolDialog" width="500">
			<v-card v-show="activeTool == 1">
				<v-card-title class="headline grey lighten-2" primary-title>
					Signature
				</v-card-title>
					
				<v-card-text class="sign-canvas">
					<input type="color"  class="js-color-picker  color-picker">
					<input type="range" class="js-line-range" min="1" max="72" value="1">
					<label class="js-range-value">1</label>Px
					<canvas class="js-paint paint-canvas" ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
				</v-card-text>

				<v-card-actions>
					<v-btn flat color="grey" @click="cancelTool()">Cancel</v-btn>
					<v-btn flat color="grey" @click="clearCanvas()">Clear</v-btn>
					<v-spacer></v-spacer>
					<v-btn flat color="orange" @click="accept">Accept</v-btn>
				</v-card-actions>
			</v-card>

			<v-card v-show="activeTool == 2">
    			<v-card-title class="headline grey lighten-2" primary-title>
          			Sign at place
        		</v-card-title>

				<v-card-text>
					<v-text-field v-model="signPlace.signName" label="Name" required></v-text-field>
					<v-text-field v-model="signPlace.signEmail" label="Email" required></v-text-field>
					<v-text-field v-model="signPlace.signPhone" label="Phone" required></v-text-field>
				</v-card-text>

				<v-card-actions>
					<v-btn flat color="grey" @click="cancelTool()">Cancel</v-btn>
					<v-spacer></v-spacer>
					<v-btn flat color="orange" @click="accept">Accept</v-btn>
				</v-card-actions>
			</v-card>

			<v-card v-show="activeTool == 3">
    			<v-card-title class="headline grey lighten-2" primary-title>
          			Text field
        		</v-card-title>

				<v-card-text>
					<input type="range" min="12" max="48" :value="textSize" @change="getTextSize">
					<label class="js-range-value">{{textSize}}</label>Px
					<v-text-field v-model="signText" label="Type your text" id="sign-text-input" class="sign-text-input" required :style="'font-size: ' + textSize + 'px;'"></v-text-field>
				</v-card-text>

				<v-card-actions>
					<v-btn flat color="grey" @click="cancelTool()">Cancel</v-btn>
					<v-spacer></v-spacer>
					<v-btn flat color="orange" @click="accept">Accept</v-btn>
				</v-card-actions>
			</v-card>

			<v-card v-show="activeTool == 4">
    			<v-card-title class="headline grey lighten-2" primary-title>
          			Image field
        		</v-card-title>

				<v-card-text>
					<form v-if="!signPicture" class="file-form sign-image">
						<input type="file" @change="getFile" id="loader" accept="image/*">
						
						<div class="drag-place">
							<v-icon x-large>cloud_upload</v-icon>
							<p class="subtitle-2">Drag and drop or click to upload a file</p>
						</div>
					</form>

					<img v-if="signPicture" class="sign-image-uploaded" :src="signPicture" alt="">
				</v-card-text>

				<v-card-actions>
					<v-btn flat color="grey" @click="cancelTool()">Cancel</v-btn>
					<v-spacer></v-spacer>
					<v-btn flat color="orange" @click="accept">Accept</v-btn>
				</v-card-actions>
			</v-card>

			<v-card v-show="activeTool == 5">
    			<v-card-title class="headline grey lighten-2" primary-title>
          			Checkbox field
        		</v-card-title>

				<v-card-text>
					<v-layout align-center class="sign-check">
						<v-checkbox v-model="checkbox" hide-details class="shrink mr-2"></v-checkbox>
						<v-text-field label=""></v-text-field>

						<canvas class="canvas-check" width="270px" height="35px"></canvas>
					</v-layout>
				</v-card-text>

				<v-card-actions>
					<v-btn flat color="grey" @click="cancelTool()">Cancel</v-btn>
					<v-spacer></v-spacer>
					<v-btn flat color="orange" @click="accept">Accept</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<div v-if="accepted" class="overflow"></div>
	</div>
</template>

<script>
	import html2canvas from 'html2canvas';

	export default {
		name: 'ToolBar',

		props: ['accepted'],

		data() {
			return {
				signImage: '',
				signText: '',
				signPicture: '',
				signPlace: {
					signName: '',
					signEmail: '',
					signPhone: '',
				},
				activeTool: 0,
				openToolDialog: false,
				checkbox: false,
				canvasWidth: 300,
				canvasHeight: 300,
				textSize: 16
			};
		},
		
		mounted() {
			window.addEventListener("resize", this.onResize);
			this.widthWatcher();
		},

		methods: {
			widthWatcher(){
				if(window.innerWidth - 17 < 768){
					this.legendNav = false;
					this.canvasWidth = 200;
					this.canvasHeight = 200;
				}else{
					this.legendNav = true;
					this.canvasWidth = 300;
					this.canvasHeight = 300;
				}
			},

			onResize() {
				this.widthWatcher();
			},

			getTextSize(e){
				this.textSize = e.target.value;
			},

			setActiveTool(key){
				this.activeTool = key;

				this.openToolDialog = true;

				if(this.activeTool == 1){
					this.initCanvas();
				}
				
				this.$emit('chooseTool', key);
			},
			
			getFile(e){
				let file = e.target.files[0];
				
				let reader = new FileReader(),
					self = this;

				reader.onload = function(e){
					self.signPicture = e.target.result;
				};
				reader.readAsDataURL(file);
			},

			clearCanvas(){
				let paintCanvas = document.querySelector( '.js-paint' ),
					context = paintCanvas.getContext( '2d' );
				
				context.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
			},

			accept(){
				let data = {};

				if(this.activeTool != 5){
					if(this.activeTool == 1){
						let paintCanvas = document.querySelector( '.js-paint' );
						this.signImage = paintCanvas.toDataURL();

						data = {
							type: 'sign',
							data: this.signImage,
							icon: 'edit',
							text: 'Sign Added',
							x: 0,
							y: 0
						};
					}

					if(this.activeTool == 2){
						data = {
							type: 'signPlace',
							data: this.signPlace,
							icon: 'email',
							text: 'Sign at place Added',
							x: 0,
							y: 0,
							width: 165,
							height: 85
						};
					}

					if(this.activeTool == 3){
						console.log(this.textColor);
						data = {
							type: 'text',
							data: this.signText,
							icon: 'text_fields',
							text: 'Text Added',
							x: 0,
							y: 0,
							size: this.textSize
						};
					}

					if(this.activeTool == 4){
						data = {
							type: 'image',
							data: this.signPicture,
							icon: 'add_photo_alternate',
							text: 'Image Added',
							x: 0,
							y: 0
						};
					}

					this.$emit('acceptTool', data);
					this.cancelTool();
				}else{
					let node = document.querySelector('.sign-check'),
						self = this;
					
					html2canvas(node).then((canvas) => {
						let image = canvas.toDataURL();
						
						data = {
							type: 'image',
							data: image,
							icon: 'check',
							text: 'Checkbox Added',
							x: 0,
							y: 0
						};

						self.$emit('acceptTool', data);
						self.cancelTool();
					});
				}
			},

			cancelTool(){
				this.activeTool = 0;
				this.openToolDialog = false;

				this.signImage = '';
				this.signText = '';
				this.signPicture = '';

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
					console.log(event);
					isMouseDown = true;   
					[x, y] = [event.offsetX, event.offsetY];  
				}
				
				const drawLine = event => {
					console.log(event);
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
	.tools{
		position: fixed;
		top: 65px;
		left: calc(50% + 40px);
		transform: translateX(-50%);
		z-index: 1000;
		border: 1px solid #757575;
		background-color: #fafafa;
		border-bottom-left-radius: 6px;
		border-bottom-right-radius: 6px;
		border-top: none;
	}

	.tools button{
		margin-top: 0;
		margin-bottom: 0;
	}

	.v-input--selection-controls{
		margin-top: 6px;
	}

	.file-form.sign-image{
		width: 100%;
	}

	.sign-image-uploaded{
		max-width: 468px;
	}

	.overflow{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .5);
	}

	.canvas-check{
		position: absolute;
		opacity: 0;
		z-index: -1;
	}

	.sign-text-input input{
		color: inherit!important;
	}

	@media(max-width: 768px){
		.tools{
			left: 10px;
			width: calc(100% - 20px);
			transform: translateX(0);
			top: 58px;
			display: flex;
			justify-content: space-between;
		}
	}
</style>
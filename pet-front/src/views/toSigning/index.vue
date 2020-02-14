<template>
  	<v-layout pa-2 class="templates" fill-height>
		<v-flex xs12 align-self-center>
			<div class="placeholder">
				<img src="https://i.ya-webdesign.com/images/page-vector-black-2.png" alt="">
				<p class="title">Sorry, you haven't received any documents yet.</p>
			</div>
		</v-flex>
	</v-layout>
</template>

<script>

	export default {
		name: "ToSigning"
	};
</script>

<style>
	.placeholder{
		text-align: center;
		opacity: .4;
	}

	.placeholder img{
		width: 300px;
	}
</style>
<template>
	<div class="monument-gallery">
		<h1 class="heading-txt">Photo Gallery</h1>
		<v-carousel hide-delimiters>
			<v-carousel-item v-for="(item,i) in monument_image" v-bind:src="item.url" :key="i" transition="fade"
      reverseTransition="fade"></v-carousel-item>
	    </v-carousel>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				monument_image: {}
			}
		},
		props: ['monumentCarouselImages'],
		mounted(){
			this.monument_image = this.monumentCarouselImages
		}
	}
</script>

<style scoped lang="stylus">
	.monument-gallery  
		margin 0 16px
	.carousel
		height 80vh !important	
</style>

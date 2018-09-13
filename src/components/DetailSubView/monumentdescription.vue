<template>
	<div class="monument-desc brd-btm" v-if="this.monumentDescription && Object.keys(this.monumentDescription).length > 1">
		<h1 class="heading-txt" v-html="convertIntoHTML(monument_name)"></h1>        
        <div class="txt-desc" v-if="!showfullDescription" v-html="convertIntoHTML(monument_desc).substring(0, readMoreTextLength)"></div>
		<div class="txt-desc" v-if="showfullDescription" v-html="convertIntoHTML(monument_desc)"></div>
		<div class="txt-c readMoreText" v-if="!showfullDescription" @click="showfullDescription = true">{{convertIntoHTML(monument_desc).length > readMoreTextLength ? 'Read More' : ''}}</div>
		<div class="txt-c readMoreText" v-if="showfullDescription" @click="showfullDescription = false">{{convertIntoHTML(monument_desc).length > readMoreTextLength ? 'Read Less' : ''}}</div>
	</div>
</template>
<script>
	export default {
		data () {
			return {
                readMore : false,  
                showDescription : false,
                readMoreTextLength : 200,
                showfullDescription : false,
				monument_desc:'',
				monument_name:''
			}
		},
		props : ['monumentDescription','monumentName'],
		mounted() {
			this.monument_desc = this.monumentDescription
			this.monument_name = 'About '+this.monumentName
		},
		methods :{
			convertIntoHTML(txt){
				var t =  new DOMParser().parseFromString(txt,'text/html').body
				return t.innerText
			}
		}
	}
</script>

<style scoped>
.monument-desc {
	margin :0 16px;
}
.c-grey {
	font-size :14px;
	color: #666;
}
.readMoreText{
    cursor:pointer;  
    color: #2788e6;
	font-size: 16px;
	margin-bottom: 10px;
	margin-top: 2px;
  }
</style>

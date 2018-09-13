<template>
	<div class="nearby-act brd-btm" v-if="nearbyAct != null && Object.keys(nearbyAct).length > 0 && this.cityId.length > 0">
		<h1 class="heading-txt">More Things To Do In {{this.cityName}} </h1>
		<div class="block">
			<div v-for="(items,index) in nearbyAct" :key="index" :src="items.activityImageURL" class="d-iblock">
				<div class="img-b"><img :src="items.activityImageURL" class="img-resp"></div>
				<div class="block-btm">
					<h3>{{items.title}}</h3>
					<div class="price">
						<span class="txt-66">Starting From</span><br>
						<strong>&#8377 {{numberComma(items.startingPrice)}} </strong>
					</div>
					<div class="yt-ico-rating yt-rating-4"></div>
					<a class="btn-red" :href="items.detailURL">View Details</a>
				</div>
      		</div>
      	</div>
	</div>
</template>
<script>
	import {activityNearby} from '../../api/api'
	import {numberWithCommas} from '../../helper/pwaMonumentsHelper'
	  export default {
		name:"nearby-activity",
		props :['cityName', 'cityId'],  
		data () {
		  return {  
			nearbyAct : {}
		  }   
		}, 
		 created () {	 
		  let self = this
		  let hotelParams = {
			 "magnumCityId": this.cityId,
			 "sortType":"desc",
			 "sortBy":"price",
			 "categoryIds":[1,2,3,5,6,7,8,9],
			 "priceRange":[{
				"minPrice":1,
				"maxPrice":2017
			  }],
			 "page":1,
			 "pageSize":5
			}
		  activityNearby(hotelParams).then(response => {
			 self.nearbyAct =response.data.activityDetailsSearchWSOs
		  }, response => {
			 self.nearbyAct = {}
		  }); 
		},
		methods : {
			numberComma(price){
				return numberWithCommas(price)
			}
		}
	  }
</script>
<style scoped lang="stylus">
.nearby-act
	margin 0 16px 16px 16px
	.block
		white-space nowrap
		overflow-x scroll
		.d-iblock
			display inline-block
			vertical-align top
			width 90%
			margin-right 16px
			position relative
			h3
				font-weight: normal;
				white-space: normal;
				line-height: 20px;
				font-size: 15px;
			.txt-66
				color #666
				font-size 14px
			.btn-red
				background-color: #ea2330;
				color: #fff;
				padding: 8px;
				border-radius: 3px;
				text-decoration: none;
				position: absolute;
				right: 10px;
				bottom: 10px;
				font-size: 14px;
			.price
				margin-top 10px
				strong
					font-size: 20px;
					font-weight: normal;
					color: #2788e6;
</style>

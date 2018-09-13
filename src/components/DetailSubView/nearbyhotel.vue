<template>
	<div class="hotel-nearby brd-btm" v-if="Object.keys(nearbyHotels).length>0 && this.cityId.length > 0" >
		<h1 class="heading-txt">Book Hotels in {{this.cityName}}</h1>
		<div class="block">
			<div v-for="(items,index) in nearbyHotels" :key="index" class="d-iblock" v-bind:class="{ w100: wfull}">
				<div class="img-b"><img :src="items.image" class="img-resp"></div>
				<div class="block-btm">
					<h3>{{items.name}}</h3>
					<div class="price">
						<span class="txt-66">Starting From</span><br>
						<strong> <span>&#8377</span>{{numberComma(items.pricing.price)}} </strong>
					</div>
					<div class="yt-ico-rating yt-rating-4"></div>
					<a class="btn-red" :href="items.detailURL">Choose Room</a>
				</div>
      		</div>
	    </div>
	</div>
</template>
<script>
import {hotelNearby} from '../../api/api'
import {numberWithCommas} from '../../helper/pwaMonumentsHelper'	
  export default {
    name:"nearby-hotels",
	props:['cityName', 'cityId'],
	 data () {
      return {  
        nearbyHotels : {},
		 wfull: false
      }   
    }, 
    created () {
      let self = this
      let cityName = this.cityName
      
      let checkInDate = new Date(new Date().setDate(new Date().getDate()+1))
      checkInDate = self.findDisplayDate(checkInDate)    
       
      let checkOutDate = new Date(new Date().setDate(new Date().getDate()+2))
      checkOutDate = self.findDisplayDate(checkOutDate)
        
      hotelNearby(cityName,checkInDate,checkOutDate).then(response => {
         self.status = response.data.meta.status
         self.nearbyHotels = (response.data.data && response.data.data.hotels)?response.data.data.hotels:''
		  if(self.nearbyHotels && self.nearbyHotels.length==1){
			  this.wfull = true
		  }
		 
      }, response => {
         self.nearbyHotels = {}
      }); 
    },
    methods : {
		numberComma(price){
           return numberWithCommas(price)
		},
        findDisplayDate (date){
             return this.getDateFormat(date) +'/'+ this.getMonthFormat(date) + '/'+date.getFullYear()
        },
        getMonthFormat(d) {
             var nd = d.getMonth() == '00' ? '0'+(d.getMonth() + 1) : d.getMonth() + 1
             return nd
        },
        getDateFormat(d) {
             return (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())
        }
    }
  }
</script>
<style scoped lang="stylus">
.hotel-nearby
	margin 0 16px 16px 16px
	padding-bottom 16px
	.block
		white-space nowrap
		overflow-x scroll
		.d-iblock
			display inline-block
			vertical-align top
			width 90%
			margin-right 16px
			position relative
			.btn-red
				background-color #ea2330
				color #fff
				padding 8px
				border-radius 3px
				text-decoration none
				position absolute
				right 10px
				bottom 10px
				font-size 14px
			.txt-66
				color #666
				font-size 14px
			.price
				strong
					font-size 20px
					font-weight normal
					color #2788e6
		.w100
			width 100%
</style>

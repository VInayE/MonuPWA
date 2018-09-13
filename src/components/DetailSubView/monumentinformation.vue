<template>
	<div class="monument-information brd-btm">
	<h1 class="heading-txt">Monument Information</h1>
	<v-tabs>
		<v-tabs-bar dark color="" class="nav-tab">
		  <v-tabs-slider color="red"></v-tabs-slider>
		  <v-tabs-item
			href="'#tab-1"
		  >
		  Overview
		  </v-tabs-item>
		   <v-tabs-item
			href="'#tab-2"
		  >
			Weather
		  </v-tabs-item>
		   <v-tabs-item
			href="'#tab-3"
		  >
			Location
		  </v-tabs-item>
		   <v-tabs-item
			href="'#tab-4"
		  >
			Facilities
		  </v-tabs-item>
		  <v-tabs-item
			href="'#tab-5" v-if="monument_info.accomodations" 
		  >
			Accommodation
		  </v-tabs-item>
		  
		   <v-tabs-item
			href="'#tab-6"
		  >
			Contact Details
		  </v-tabs-item>
		  <v-tabs-item
			href="'#tab-7" v-if="monument_info.museums"
		  >
			Museums
		  </v-tabs-item>
		  
		</v-tabs-bar>
		<v-tabs-items>
		  <v-tabs-content
			id="'tab-1"
		  >
			<v-card flat>
			  <v-card-text>
			  	<div class="">
               <div class="pb5">
                  <h3>Address</h3>
                  <p>{{monument_info.address}}</p>
                </div>
                  <div class="pb5">
                  <h3>How To Reach</h3>
                  <ul class="nearby">
                      <li><span class="w30">Nearest Airport : </span> 
                      <span class="ml20 w50" v-if="monument_info && monument_info.nearestAirport">{{monument_info.nearestAirport.name}}</span></li>
                      <li><span class="w30">Nearest Railway Station : </span> 
                      <span class="ml20 w50" v-if="monument_info && monument_info.nearestRailwayStation">{{monument_info.nearestRailwayStation.name}}</span></li>
                      <li><span class="w30">Nearest Bus Station : </span> 
                      <span class="ml20 w50" v-if="monument_info && monument_info.nearestBusStation">{{monument_info.nearestBusStation.name}}</span></li>
                  </ul>
                </div>
                <div class="pb5">
                  <h3>Opening Hours</h3>
                    <ul class="nearby">
                      <li><span class="w30">Opening Time : </span> 
                      <span class="ml20 w50" v-if="monument_info && monument_info.timings">{{monument_info.timings.openingTime}}</span></li>
                      <li><span class="w30"> Closing Time : </span> 
                      <span class="ml20 w50" v-if="monument_info && monument_info.timings">{{monument_info.timings.closingTime}}</span></li>
                      <li v-if="monument_info && monument_info.timings && monument_info.timings.closedDays && monument_info.timings.closedDays.length > 0"><span class="w30" >Closed Days : </span> <span class="ml20 w50"><span class="mr10" v-for="(days,index) in monument_info.timings.closedDays" :key="index">{{days}} </span>   </span></li>
											<li v-if="monument_info.timings && monument_info.timings.holidays && monument_info.timings.holidays.length > 0"><span class="w30" >Holidays : </span> <span class="ml20 w50"><span class="mr10" v-for="(days,index) in monument_info.timings.holidays" :key="index">{{formatDate(days)}} </span>   </span></li>
											<li v-for="(externalLink,index) in monument_info.externalLinks" :key="index" @click="linkToNight(externalLink.link)" class="link_to_night">{{externalLink.name}}</li>
                  	</ul>
                  </div>
                </div>  
			  </v-card-text>
			</v-card>
		  </v-tabs-content>
		  
		  <v-tabs-content			
			id="'tab-2"
		  >
			<v-card flat>
			  <v-card-text>
				<h3>Weather</h3>
					<ul class="mt5">
						<li class="weather-desc" v-if="showWeather">
							<p v-html="convertIntoHTML('Monsoon : ',monument_info.weatherMonsoon.description, 'ico-rain')"></p>
							<p v-html="convertIntoHTML('Summer : ',monument_info.weatherSummer.description,'ico-summer')"></p>
							<p v-html="convertIntoHTML('Winter : ',monument_info.weatherWinter.description,'ico-winter')"></p>
							<p v-html="convertIntoHTML('Recommended Season to Visit : ',monument_info.recommendedSeason,'ico-season')"></p>
						</li>
					</ul>
			  </v-card-text>
			</v-card>
		  </v-tabs-content>
		  
		  <v-tabs-content id="'tab-3">
		<div class="home-list-map" style="height:500px;width:100%;">
          <div id="pwa-monument-map" style="width:100%;height:100%"></div> 
        </div>
		  </v-tabs-content>
		  
		  <v-tabs-content id="'tab-4">
			<v-card flat>
			  <v-card-text>
			  	<h3>Facilities available At the Monument</h3>
                <ul class="mt5">
                    <li v-for="(facilty,index) in monument_info.facilitiesAvailable" :key="index" v-html="facilty" class="f-li"></li>
                </ul>
			  </v-card-text>
			</v-card>
		  </v-tabs-content>
		  
		  <v-tabs-content id="'tab-5">
			<v-card flat>
			  <v-card-text>
			  <h3>Accommodation near the monument</h3>
                <ul v-for="(accomodation,index) in monument_info.accomodations" :key="index" class="mt5">
                    <li>{{accomodation.name}}</li>
                    <li @click="openMore(accomodation.link)" class="link_to_night" v-if="accomodation.link">More Details ... </li>
                </ul>
			  </v-card-text>
			</v-card>
		  </v-tabs-content>
		  
		  <v-tabs-content id="'tab-6">
			<v-card flat>
			  <v-card-text>
			  <h3>Contact Details</h3>
                <ul v-for="(contact,index) in monument_info.contactsInfo" :key="index" class="mt5">
                    <li class="bold">{{contact.name}}</li>
                    <li>{{contact.designation}}</li>
                    <li v-if="contact.phone.length > 0">Phone: <span v-for="(phone,index) in contact.phone" :key="index">{{phone}} {{index+1 == contact.phone.length ? '' : ','}}</span> </li>
                    <li v-if="contact.email.length > 0">E-mail: <span v-for="(email,index) in contact.email" :key="index">{{email}} {{index+1 == contact.email.length ? '' : ','}}  </span></li>
                </ul>
			  </v-card-text>
			</v-card>
		  </v-tabs-content>
		  
		  <v-tabs-content id="'tab-7">
			<v-card flat>
			  <v-card-text>
			  	<h3>Museums near monument</h3>
                <ul v-for="(muesum,index) in monument_info.museums" :key="index" class="mt5">
                    <li>- {{muesum.name}}</li>
                    <li class="link_to_night" @click="openExternalMuesumMonument(muesum.link)">View Museum Details</li>
                </ul>
			  </v-card-text>
			</v-card>
		  </v-tabs-content>
		</v-tabs-items>
  </v-tabs>
	</div>
</template>
<script>
import {initializeDetailsGoogleMaps} from '../../helper/pwaMonumentMap'
export default {
	data(){
		return {
			monument_info:'',
			showWeather: false
		}
	},
	props: ['monumentInfo'],
	mounted(){
		this.monument_info = this.monumentInfo
		this.showWeather = true
		 initializeDetailsGoogleMaps(this.monument_info.locationInfo.latitude,this.monument_info.locationInfo.longitude,this.monument_info.shortTitle,this.monument_info.address) 
	},
	 methods :{
		 convertIntoHTML(weather , txt, icon){
		   if(txt){
			 return `<i class='ico-sprite ${icon}'></i>` + `<b>${weather}</b>` +' ' + txt
		   } else {
			 return ''
		   }

		  },  
		openExternalMuesumMonument (link){
		   window.open(link,'_blank')
		},
		linkToNight(externalLink){
		   window.open(externalLink,'_blank') 
		},
		formatDate (time){
			var date = new Date(time)
			return date.getDate() + '/' + date.getMonth()+1 +'/' + date.getFullYear()
		},
		openMore(externalLink){
			window.open(externalLink,'_blank')  
		}
  }
}
</script>

<style scoped lang="stylus">
.monument-information 
	margin 0 16px
	padding-bottom 16px
	.pb5 ,.f-li
		padding-bottom 5px
	.w30 
		color #000
	
</style>

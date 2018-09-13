<template>
    <v-app name="monument-review" v-if="Object.keys(reviewData).length > 0">
      <v-toolbar class="monument-header">
		  <v-layout row wrap class="m0">
				<v-flex xs1 class="header_arrow_back">
			  <v-icon @click="navigateToDetail()">arrow_back</v-icon>
			</v-flex> 
			  <v-flex xs9 class=""><div class="lh29 fs20">Review Your Booking</div></v-flex>
		  </v-layout>
	  </v-toolbar>
      <v-card color="" flat class="mt10">
      	<v-card-text>
		   <v-layout row wrap class="m-detail">
		   	   <!--<v-flex xs12 class="mb25 fs18">Travel Card Details</v-flex>-->
		   	   <div class="card-review">
				   <v-flex xs6 
						v-if="reviewData && Object.keys(reviewData).length > 0" 
						v-for="(item,index) in reviewData" 
						:key="index">
					   <img :src="item.imageUrl" style="width:100%"/>
					   <v-layout row wrap>
						   <v-flex xs12><h4>{{item.shortTitle}}</h4></v-flex>
						   <v-flex xs12 city-title>{{item.cityName}}</v-flex>
						   <v-flex city-date xs12 v-html="getVisitDate(item.visitDate)"></v-flex>
                           <v-flex v-if=" item.timeSlot && Object.keys(item.timeSlot).length > 0">
                            <p style="font-size:14px;color:#2788e6">
                                {{item.timeSlot.startTime}} - {{item.timeSlot.endTime}}
                            </p>
                           </v-flex>
					   </v-layout>
				   </v-flex>
				</div>
		   </v-layout>
		</v-card-text>
	  </v-card>
	  <v-card color="" flat class="mt10">
		<v-card-text class="visitor-detail">
			<v-layout row wrap>
			   <v-flex xs12 fs18>Visitors Details</v-flex>
			</v-layout>
			<v-layout row wrap class="v-title">
            <!--   <v-flex xs5>Place</v-flex>-->
			   <v-flex xs5>Name</v-flex>
			   <v-flex xs2>Age</v-flex>
			   <v-flex xs3>Country</v-flex>
			   <v-flex xs2>PaxType</v-flex>
			</v-layout>
			<!-- <v-layout v-if="reviewData && Object.keys(reviewData).length > 0" row wrap v-for="(details,index) in reviewData[]" :key="index"> -->
			   <v-flex xs12 v-if="reviewData[Object.keys(reviewData)[0]] && reviewData[Object.keys(reviewData)[0]].paxInfo">
				<v-layout row wrap v-for="(user, index) in reviewData[Object.keys(reviewData)[0]].paxInfo" :key="index">
					<v-flex xs5>{{user.name}}</v-flex>
					<v-flex xs2 class="fs14">{{user.age}}</v-flex>
					<v-flex xs3 class="fs14">{{user.countryName}}</v-flex>
					<v-flex xs2 class="fs14">{{user.paxType}}</v-flex>
				</v-layout>
			   </v-flex>
			<!-- </v-layout> -->
            
		</v-card-text>
	  </v-card>
	  <v-card color="" flat class="mt10">
		<v-card-text>
			<v-layout row wrap class="mb15">
			<v-flex xs6>Total Amount</v-flex>
			<v-flex xs6 class="txt-r rupee">&#8377 {{totalPrice}}</v-flex>
			</v-layout>
		</v-card-text>

	  </v-card>
	  <v-card color="" flat class="mt10">
		<v-card-text>
			<v-layout row wrap class="mb15">
			<v-flex xs12 fs18>Terms & Conditions</v-flex>
			<v-flex xs12 class="">
				<ul  class="t-c clearfix">
					<li >The e-ticket is not transferable.</li>
					<li >Entry Fee is not refundable.</li>
					<li >E-ticket cancellations are not permitted.</li>
					<li >The Monument is open for visitors between sunrise and sunset.</li>
					<li >Visitor shall be required to show photo identity proof in original at the entry to the monument.</li><li >Edibles are not allowed inside the monument.</li>
					<li >Inflammable/dangerous/explosive articles are not allowed.</li>
				</ul>
			</v-flex>
			</v-layout>
		</v-card-text>
		<v-card-text>
			<v-layout row wrap class="">
			<v-flex xs6></v-flex>
			<v-flex xs6 class="txt-r"></v-flex>
			</v-layout>
		</v-card-text>
	  </v-card>
		<div class="redBtn fixedbtn" @click="navigateToPayment()">Continue to Pay</div>
    </v-app>
</template>
<script>
    import {getPaxDetails,getReviewSummaryAPI} from '../api/api'
    import { adobeAnalyticsPageView } from '../helper/adobeAnalytic'
    export default {
       data (){
           return {
             reviewData:{},
             monumentID:'',
			 superPnr:'',
			 price: '',
			 shorttitile: '',
			 totalPrice: 0
           }
       }, 
       methods:{
         getVisitDate(date){
           let monthName=['Jan','Feb','March','April','May','June','July','August','Sept','Oct','Nov','Dec']   
           let newDate = new Date(date)
           return newDate.getDate() + ' '+monthName[newDate.getMonth()]+','+newDate.getFullYear()
		 },
		 navigateToDetail(){
			this.$router.push({name:'AddTravellersView'})
		 },
		 navigateToPayment(){
			this.price = this.totalPrice
			localStorage.setItem('setMonumentPrice',this.price)
		  	this.$store.commit('setMonumentPrice',this.price)
          	this.$router.push({name:'MonumentPaymentView'})
		 },
		 convertIntoHTML(txt){
			var t =  new DOMParser().parseFromString(txt,'text/html').body
			return t.innerText
		 }
       },
       mounted (){
		   this.shorttitile = localStorage.getItem('monument_shorttitle')
           let userLoginParams= {
                includeOptionalParams:true,
                channel:'B2C',
                productId:'yatrapwamonuments'
           }
           let self = this
           self.monumentID =localStorage.getItem('monument_Id')
		   self.superPnr = localStorage.getItem('superPnr')
		   getPaxDetails(self.superPnr).then(function (response) {
			  //console.log(response)
			  self.reviewData = response.data.data.monumentBookingDetails
			  self.totalPrice = response.data.data.totalPrice
              //400 bad request code needs to be added
           }).catch(function (error) {
               console.log(error,'Please try again later');
           })
           adobeAnalyticsPageView("yt:monument:dom:review traveller","monuments","business","monument checkout","domestic monument","review traveller")
       }          
    }
</script>


<style scoped="true">
	.m0{
		margin-left: 0 !important;
	}
	.mb25 {
		margin-bottom: 25px;
	}
	.m-detail img {
		min-height: 100px;
		height: auto;
		border-radius: 2.88px;
		background: url("../assets/images/left-tupple.gif") no-repeat center;
	}
	.ml19 {
		margin-left: 19px;
	}
	.txt-city {
		color: #999;
		font-size: 12px;
	}
	.travel{
		font-size: 12px;
		border-top: 1px solid #E0E0E0;
		margin: 5px 0;
		padding: 5px 0;
	}
	.visitor-detail .xs12 {
		margin-bottom: 15px;
	}
	.v-title {
		font-size: 12px;
		color: #999;
		border-bottom: 1px solid #e0e0e0;
		padding-bottom: 5px;
		margin-bottom: 5px
	}
	.txt-r {
		text-align: right;
	}
	.fixedbtn {
		position: fixed;
		bottom: 0;
	}
	.rupee {
		font-size: 18px;
		color: #1976d2;
	}
	.t-c {
		margin-top: 16px;
	}
	.t-c li{
		list-style-type: disc;
		margin-left: 16px;
		color: #999;
		font-size: 12px;
		margin-bottom: 5px;
	}
	.card-review {
		white-space: nowrap;
		overflow: hidden;
		overflow-x: scroll;
	}
	.card-review > .flex {
		display: inline-block;
		margin-right: 30px;
	}
	.card-review h4 {
		white-space: normal;
		font-weight: normal;
		line-height: 20px;
		font-size: 15px;
	}
	.city-title {
		font-size: 80%;
	}
	.city-date {
		color: #2788e6;
    font-size: 14px;
	}
</style>

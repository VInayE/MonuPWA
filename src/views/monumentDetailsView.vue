<template>
	<v-app class="monument-detail"  >
	 	<div class="flex-item p16 prel" ref="detailsBanner">
			<v-layout row wrap class="search-header" v-bind:class="{ sticky: stickyHeader}">
				<v-flex xs1 class="header_arrow_back">
				<v-icon @click="navigateToSrp()">arrow_back</v-icon>
				</v-flex>
				<v-flex xs7 class="lh35 ellip" v-if="title.length > 0" v-html="convertIntoHTML(title)"></v-flex>            
				<v-flex xs3 @click="navigateToLogin()"
						v-bind:class="{ disabled: !openDetailView }"
						v-if="cartLength == -1"
						class="prel count-cart txt-r">
						<span class="cart-count"> ! </span>
						<img src="../assets/images/cart_icon.png">
					</v-flex>
					<v-flex xs3 @click="isLoggedIn ? openCartBlock() : navigateToLogin()"
						v-bind:class="{ disabled: !openDetailView }"
						v-if="cartLength >= 0"
						class="prel count-cart txt-r">
						<span v-if="cartLength >= 0" class="cart-count"> {{cartLength}} </span>
						<img src="../assets/images/cart_icon.png">
					</v-flex>
			</v-layout>
		</div>

		<div class="tupple-loading" v-if=!isReady>
			
		</div>
		 <detail-carousel
		 	v-if="Object.keys(monumentDetailsData).length>0 && isReady" 
			@cartLen = "cartLength = $event" 
			:monumentInfo="monumentDetailsData" 
			:monumentCarouselImages="monumentDetailsData.imagesInfo" 
			:bookingAllowed="monumentDetailsData.isBookable" 
			:closingTimings="monumentDetailsData.timings" 
			:disabledAdd="disabledAdd" 
			:cartDataId="cartDataId">
		 </detail-carousel>
		 <monument-description v-if="Object.keys(monumentDetailsData).length>0" :monumentDescription="monumentDetailsData.description" :monumentName="monumentDetailsData.shortTitle"></monument-description>
		 <monument-information v-if="Object.keys(monumentDetailsData).length>0" :monumentInfo="monumentDetailsData"></monument-information>
		 <monument-ticket-info v-if="Object.keys(monumentDetailsData).length>0" :bookingAllowed="monumentDetailsData.isBookable" :monumentPriceInfo="monumentDetailsData.priceInfo"></monument-ticket-info>
		 <nearby-hotel id="nearby-hotel" v-if="Object.keys(monumentDetailsData).length>0" :cityName="monumentDetailsData.cityName" :cityId="monumentDetailsData.cityId"></nearby-hotel>
		 <nearby-activity id="nearby-activity" v-if="Object.keys(monumentDetailsData).length>0" :cityName="monumentDetailsData.cityName" :cityId="monumentDetailsData.cityId"></nearby-activity>
		 <!--<monument-detail-gallery id="monument-gallery" v-if="Object.keys(monumentDetailsData).length>0 && monumentDetailsData.imagesInfo.length >1"  :monumentCarouselImages="monumentDetailsData.imagesInfo"></monument-detail-gallery>-->
      <div class="ajax-loader" v-if="showLoader">
        <div class="sk-wave">
          <div class="sk-rect sk-rect1"></div>
          <div class="sk-rect sk-rect2"></div>
          <div class="sk-rect sk-rect3"></div>
          <div class="sk-rect sk-rect4"></div>
          <div class="sk-rect sk-rect5"></div>
        </div>
      </div>
	  <v-snackbar :timeout="timeout" :bottom=" y === 'bottom'" :multi-line="true" v-model="snackbarInfo">
		{{snackbarInfoMsg}}
		<v-btn flat class="txt-ff close-snack" @click.native="snackbarInfo = false">Close</v-btn>
	  </v-snackbar>
	</v-app>
</template>
<script>
	import Vue from 'vue'
	import {
		fetchMonumentDetailsDataAPI,
		checkUserProfile,
		retrieveCartAPI,
  		saveMonumentToCartAPI,
		getCartItems,
		cartItemCount
	} from '../api/api'
	import { adobeAnalyticsPageView } from '../helper/adobeAnalytic'
	import axios from 'axios'
	export default {
		name: 'monument_detail',
		data () {
      		return {
				title: '',
				showLoader: true,
				cartLength: 0,
				disabledAdd: false,
				openDetailView: true,
				monumentDetailsData: {},
				cartDataId: [],
				itemCount: 0,
				cartId: '',
				isReady: false,
				timeout: 1500,
				y: 'bottom',
				snackbarInfo: false,
				snackbarInfoMsg: '',
				stickyHeader:false
			}
		},
		components: {
			DetailCarousel: () =>
				import ('../components/DetailSubView/detailCarousel.vue'),
			MonumentDescription: () =>
				import ('../components/DetailSubView/monumentdescription.vue'),
			MonumentInformation: () =>
				import ('../components/DetailSubView/monumentinformation.vue'),
			MonumentTicketInfo: () =>
				import ('../components/DetailSubView/monumentticket.vue'),
			MonumentDetailGallery: () =>
				import ('../components/DetailSubView/monumentdetailgallery.vue'),
			NearbyHotel: () =>
				import ('../components/DetailSubView/nearbyhotel.vue'),
			NearbyActivity: () =>
				import ('../components/DetailSubView/nearbyactivity.vue'),
		},
		mounted() {
			let self = this
			window.addEventListener('scroll', this.handleScroll)
			if (this.$route.query.monumentId) {
				let monumentId = this.$route.query.monumentId
				fetchMonumentDetailsDataAPI(this.$route.query.monumentId).then(response => {
					self.monumentDetailsData = response.data.data
					self.timings = response.data.data.timings
					this.addTiming(self.timings)
					localStorage.setItem('monument_Id', response.data.data.id);
					localStorage.setItem('monument_title', response.data.data.title);
					localStorage.setItem('monument_shorttitle', response.data.data.shortTitle);
					self.title = localStorage.getItem('monument_title')
					self.showLoader = false
				}, response => {
					self.monumentDetailsData = {}
					/* window.open('https://www.yatra.com/40x.html?source=/mon','_self')*/
				})
			} else {
				if (typeof(window) !== 'undefined') {
					window.open('https://www.yatra.com/40x.html?source=/mon', '_self')
				}
			}
			self.checkUser()
			adobeAnalyticsPageView("yt:monument:dom:srp:all","monuments","business","monument detail","domestic monument","all")
		},
		methods: {
			navigateToSrp() {
				this.$router.push({
					name: 'MonumentSRPView'
				})
			},
			navigateToLogin(){
                this.$store.commit('setAppFlow', 'cartflow')
                this.$router.push({name:'LoginView'})
            },
			convertIntoHTML(txt) {
				var t = new DOMParser().parseFromString(txt, 'text/html').body
				return t.innerText
			},
			addTiming(timings) {
				this.$store.commit('setMonumentTimings', timings)
			},
			openCartBlock() {
				this.$store.commit('setCartBackRoute', 'detail')
        		this.$router.push({name:'CartBlock'})
			},
			checkUser() {
				var self = this
				//check whether user is logged in or not
				let userLoginParams= {
					includeOptionalParams:true,
					channel:'B2C',
					productId:'yatrapwamonuments'
				}
				checkUserProfile(userLoginParams).then(function(userInfo) {
					if(userInfo.data.status == 'FAIL') {
						self.isReady = true
						// ravi comment kar dena
						//self.retrieveCart(null, 'countOnly')
						console.log(userInfo.data.status, "Check User")
					}
					else {
						self.isLoggedIn = true
						self.userEmail= userInfo.data.responseData.userInfo.email
						self.userMobile= userInfo.data.responseData.userInfo.mobile
						self.userName = userInfo.data.responseData.userInfo.name + " " + userInfo.data.responseData.userInfo.lastName
						// saving data in local storage
						localStorage.setItem("isLoggedIn", self.isLoggedIn)
						localStorage.setItem("userEmail", self.userEmail)
						localStorage.setItem("userMobile", self.userMobile)
						localStorage.setItem("userName", self.userName)
						self.$store.commit('setUserInfoData',userInfo.data.responseData.userInfo)
						// making cart api call to fetch data
						if(self.isLoggedIn) {
							self.retrieveCart(null, 'countOnly')
						}
					}
				}).catch(function (error) {
					//self.retrieveCart(null, 'countOnly')
					self.isReady = true
					console.log(error,'Something wrong with checkApi request')
				})
			},
			retrieveCart(exitMonument, countOnly) {
				var self = this
				retrieveCartAPI().then(response => {
					self.cartId = response.data.cartId
					self.itemCount = response.data.itemCount
					self.cartLength = self.itemCount
					localStorage.setItem("cartId", self.cartId)
					localStorage.setItem("itemCount", self.itemCount)
					if(!self.cartId || self.cartId == 'undefined') {
						self.cartLength = -1
					}
					if(exitMonument) {
						self.savingMonument(self.cartId)
					} else {
						self.getCartItemsCall(self.cartId)
					}
					// if(countOnly == 'countOnly') {
					// 	self.fetchingCartCount(self.cartId)
					// }
				}).catch(error => {
					self.isReady = true
					self.snackbarInfo = true
					self.snackbarInfoMsg = "Can't save monument now. Please try again later"
					console.log(error, 'Issue with retrieve cart API')
				})
			},			
			fetchingCartCount(cartId) {
				cartItemCount(cartId).then(response => {
					this.cartLength = response.count
				})
			},
			getCartItemsCall(cartId) {
				var self = this
				if(cartId) {
					getCartItems(cartId).then(response => {
						self.cartDataId = response.data.itemList
						self.getItemLoader = true
						// disabling add to cart button
						self.cartDataId.map(function(item, index) {
							//console.log(item.itemId)
							if(item.productId == self.$route.query.monumentId) {
								self.disabledAdd = true
							}
						})
						// mounting detail carousel view to save item
						self.isReady = true
					}).catch(error => {
						console.log(error, "cart can't be fecthed")
					})
				}
				else {
					console.log('There has been some issue with cart ID')
				}
			},
			handleScroll(event) {
			   if(this.$refs.detailsBanner && (document.documentElement.scrollTop > this.$refs.detailsBanner.clientHeight-50)) {
				   this.stickyHeader = true
			   } else {
				 this.stickyHeader = false
			   }
			}
		}
	}

</script>
<style scoped>
	.monument-detail {
		background: #fff;
	}
	.tupple-loading {
    	border-radius: 5px;
    	min-height: 200px;
    	background: url('../assets/images/left-tupple.gif') no-repeat center;
	}
	.ajax-loader {
		position: fixed;
		width: 100%;
		background: rgba(0, 0, 0, 0.8);
		border-radius: 5px;
		line-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		min-height: 200px;
		top: 0px;
		z-index: 9999;
	}
	.header_arrow_back {
		display: flex;
	}

	.header_arrow_back i {
		position: absolute;
		top: 15px;
	}

	.ellip {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 120px;
	}
	.lh35 {
		line-height: 35px;
	}
	.cart-count{
        color: #fff;
    position: absolute;
    right: 20px;
    top: -2px;
    background-color: #ea2330;
    border-radius: 50%;
    height: 18px;
    width: 18px;
    text-align: center;
    font-size: 12px;
  }
	.sticky{
	    position: fixed;
		top: 0px;
		height: 56px;
		right: 0px;
		background: #fff;
		width: 100%!important;
		left: 0px;
		z-index: 9997;
		box-shadow: 0 0 2px #666;
		padding: 10px 16px;
     }

</style>

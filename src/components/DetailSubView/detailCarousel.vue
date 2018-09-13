<template>
	<div class="detail-carousel prel">
		<div class="banner-content resp" 
			v-if="monument_images && monument_images[0] && monument_images[0].url"  
			v-bind:style="{ backgroundImage: 'url(' + monument_images[0].url + ')' }">
		</div>

		<ul class="fixed-bar">
			<!-- removed as per discussion -->
			<!-- <li @click="navigateCalender" v-if="!disabledAdd && !intDisabledAdd">
				<input class="book_now_calender" @input="navigateCalender" type="text" placeholder="" :value="findDisplayDate(this.$store.getters.getTimings)">
                <v-icon class="cal-m">date_range</v-icon>
			</li>
			<li v-if="disabledAdd || intDisabledAdd" class="disabled">
				<input class="book_now_calender" type="text" placeholder="" :value="findDisplayDate(this.$store.getters.getTimings)">
                <v-icon class="cal-m">date_range</v-icon>
			</li>
			<li v-if="time_slots.length > 0 && booking_allowed" class="drop-down prel" v-bind:class="{ disabled: disabledAdd || intDisabledAdd }">
              <select type="text" v-model="timeSlot"
			  	:disabled="disabledAdd || intDisabledAdd">
                <option v-for="(timeslot, index) in time_slots" 
                  :key="index" 
                  :value="timeslot.name + '__' + timeslot.startTime + '__' + timeslot.endTime">
                  {{ timeslot.name }}
                </option>
              </select>
              <i class="ico-sprite ico-arr"></i>
            </li> -->
			<li 
				v-bind:class="{ disabled: disabledAdd || intDisabledAdd }"
				class="online_booking" 
				v-if="booking_allowed" 
				@click="addItem(monumentInfo)">
				Add To Cart
			</li>
		</ul>

		<v-layout row justify-center>
			<v-dialog v-model="dialog" max-width="290">
			  <v-card class="over-h">
				<v-card-text>This Monument is not currently avaliable.</v-card-text>
				<v-card-actions class="fr">
				  <button @click="navigateToSrp()">Got it</button>
				</v-card-actions>
			  </v-card>
			</v-dialog>
		</v-layout>

		<v-snackbar :timeout="timeout" :bottom=" y === 'bottom'" :multi-line="false" v-model="snackbarInfo">
			{{snackbarInfoMsg}}
			<v-btn flat class="txt-ff close-snack" @click.native="snackbarInfo = false">Close</v-btn>
		</v-snackbar>
	</div>
</template>
<script>
	import {checkMonumentAvailabilityAPI, checkUserProfile, saveMonumentToCartAPI} from '../../api/api'
	import axios from 'axios'
	export default {
		name:'detail-carousel',
		data() {
			return {
				//stickyHeader:false,
				booking_allowed: false,
				dialog: false,
				isAPICompleted: false,
				state :{
					disabled :{
						days: [],
						to: new Date(),
						dates:[]
					},
					disabled_2: {
						days: [],
						from: '',
						dates:[]
					}
				},
				time_slots: [],
				timeSlot: "",
				intDisabledAdd: false,
				timeout: 1500,
				y: 'bottom',
				snackbarInfo: false,
				snackbarInfoMsg: '',
				isLoggedIn: false,
				showCalenderDiv:false,
				calenderLength:0,
				ddate:new Date(new Date().setDate(new Date().getDate()+1)),
				closedDays : {
				'SUNDAY':0,
				'MONDAY':1,
				'TUESDAY':2,
				'WEDNESDAY':3,
				'THURSDAY':4,
				'FRIDAY':5,
				'SATURDAY':6
				},
				selectedCalenderIndex :0
			}
		},
		components :{
			CalenderView : () => import('../../views/calender.vue'),
		},
		props :{
			monumentCarouselImages : {
				type:Array,
				required :false  
			},
			bookingAllowed : {
			  	type:Boolean,
			  	required:true
			},
			closingTimings :{
			   type:Object,
			   required:true
			},
			disabledAdd :{
				type:Boolean,
			   	required:false
			},
			monumentInfo :{
				type: Object,
				required: true
			},
			cartDataId : {
				type: Array,
				required: true
			}
		},
	   	created () {
		  	this.monument_images = this.monumentCarouselImages
		  	this.booking_allowed = this.bookingAllowed
		  	if(this.closingTimings.closedDays){
			 	for(let i=0 ; i < this.closingTimings.closedDays.length ; i++){
			   		this.state.disabled.days.push(this.closedDays[this.closingTimings.closedDays[i]])
			   		this.state.disabled_2.days.push(this.closedDays[this.closingTimings.closedDays[i]])
			 	}
		  	}
		  	if(this.closingTimings.holidays){
				for(let i=0 ; i < this.closingTimings.holidays.length ; i++){
					this.state.disabled.dates.push(new Date(this.closingTimings.holidays[i]))
					this.state.disabled_2.dates.push(new Date(this.closingTimings.holidays[i]))
				}
		  	}
		 	this.state.disabled_2.from = new Date(this.closingTimings.maxDate)
			this.calenderLength =  this.monthDiff(new Date(), new Date(this.closingTimings.maxDate)) + 3
			 
			this.time_slots = (this.closingTimings && this.closingTimings.timeSlots && this.closingTimings.timeSlots.length > 0) ? this.closingTimings.timeSlots : [];
	  	},
		mounted () {
			let self = this
			window.addEventListener('scroll', this.handleScroll)
			window.addEventListener('keyup', function(event) {
				if(event.keyCode ==27){
					self.showCalenderDiv = false
				}
			});

		  	self.isLoggedIn = localStorage.getItem('isLoggedIn')
			self.cartId = localStorage.getItem('cartId')

			// add monument on coming back
			var exitMonument = this.$store.getters.getExitMonument
			if(Object.keys(exitMonument).length > 0) {
				//console.log(exitMonument)
				this.addItem(exitMonument)
			}
			
			/*window.addEventListener('click', function(event) {
				if(event.target.className.toString() != 'book_now_calender' && event.target.className.toString() != 'ico-sprite ico-cal-ff') {
					self.showCalenderDiv = false
				}
			});*/

			//pasting first time slot
			if (this.closingTimings && this.closingTimings.timeSlots && this.closingTimings.timeSlots.length > 0) {
			this.timeSlot =
				this.closingTimings.timeSlots[0].name +
				"__" +
				this.closingTimings.timeSlots[0].startTime +
				"__" +
				this.closingTimings.timeSlots[0].endTime;
			}
		},
		methods :{
		 addItem (monument){
			// add item to cart code
			var self = this
			//console.log(self.isLoggedIn)
			if(!self.isLoggedIn || self.isLoggedIn == 'false') {
				self.$store.commit('setExitMonument', monument)
				self.$store.commit('setAppFlow', 'cartflow')
				self.$router.push({name:'LoginView'})
			} else {
				self.savingMonument(monument, self.cartId)
			}
		 },
		 savingMonument (monument, cartId){
			let self = this
			var checkMonumentInCart = false
			self.cartDataId.map(function(item, index) {
				if(item.productId == monument.id) {
					checkMonumentInCart = true
					//console.log("item already in cart")
				}
			})
			if(!checkMonumentInCart) {
				let items = [{
					itemId : "",
					productId : monument.id,
					title : monument.shortTitle,
					"fromTime": "",
					"toTime": "",
					"imageUrl": "",
					"quantity": 1,
					"product": "Monuments"
				}]
				saveMonumentToCartAPI(items, cartId).then(response => {
					if(response.data.status) {
						self.intDisabledAdd = true
						items[0].itemId = response.data.itemIdList[0]
						self.cartDataId.push(items[0])
						self.$emit("cartLen", (self.cartDataId.length))
						self.$store.commit('setExitMonument', {})
                        self.$router.push({name:'CartBlock'})
                        this.$store.commit('setCartBackRoute', 'detail')
					} else {
						self.snackbarInfo = true
						self.snackbarInfoMsg = "Unable to add to Travel Cart"
					}
				}).catch(function(error){
					self.snackbarInfo = true
					self.snackbarInfoMsg = "Unable to add to Travel Cart"
				})
			} else {
				self.snackbarInfo = true
				self.snackbarInfoMsg = monument.shortTitle + ' is already in cart.'
			}
		 },
		 showCalenderWidget (){
        	this.showCalenderDiv = !this.showCalenderDiv
		 },
		 changeDateOnSelection (event,index){
			  this.ddate = event
			  this.showCalenderDiv = !this.showCalenderDiv
			  this.selectedCalenderIndex = index
		  },
		  findDisplayDate (date){
		     date = new Date(date)
			  this.ddate =new Date (parseInt(parseInt(date.getMonth())+1) +'/'+ date.getDate() + '/'+date.getFullYear())

			return date.getDate() +'/'+ parseInt(parseInt(date.getMonth())+1) + '/'+date.getFullYear()
		  },
		  getDate (date) {
			 var d = new Date(date)
			 return (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())
		  },
		  calculateDate (index){
			if(index == this.selectedCalenderIndex) {
				return this.ddate
			} else {
				var today = new Date(new Date().setDate(new Date().getDate()+1))
				return new Date(today.getFullYear(), today.getMonth()+index, 1)
			}
		  },
		  navigateCalender ()  {
			 localStorage.setItem("transferPath", "detailCarousel")
			 this.$router.push({name:'Calender'})
		  },
			monthDiff(d1, d2) {
				var months;
				months = (d2.getFullYear() - d1.getFullYear()) * 12;
				months -= d1.getMonth() + 1;
				months += d2.getMonth();
				return months <= 0 ? 0 : months;
			},
			/*handleScroll(event) {
			   if(this.$refs.detailsBanner && (document.documentElement.scrollTop > this.$refs.detailsBanner.clientHeight-50)) {
				   this.stickyHeader = true
			   } else {
				 this.stickyHeader = false
			   }
			},*/
			showMonumentAvailability (){
				 let self = this
				 this.isAPICompleted = true
				 let userLoginParams= {
                    includeOptionalParams:true,
                    channel:'B2C',
                    productId:'yatrapwamonuments'
                  }
				 axios.all([checkMonumentAvailabilityAPI(this.$route.query.monumentId,this.ddate), checkUserProfile(userLoginParams)]).then(axios.spread(function (monumentAvailability, userInfo) {
				   if(monumentAvailability.data.data.available){
						localStorage.setItem( 'superPnr', monumentAvailability.data.data.superPnr )
						localStorage.setItem( 'availableDate', Date.parse(self.ddate) )
						//console.log(userInfo.data.status)
						if(userInfo.data.status == 'FAIL') {
							self.$store.commit('setAppFlow', 'normal')
							self.$router.push({name:'LoginView'})
						}else{
							self.$store.commit('setUserInfoData',userInfo.data.responseData.userInfo)
							self.$router.push({name:'AddTravellersView'})
						}
				  }
                 })).catch(function (error) {

                 })
			},
			navigateToSrp ()  {
			   this.$router.push({name:'MonumentSRPView'})
			}
		}
	}
</script>
<style scoped lang="stylus">
.banner-content 
	width 100%
	height 320px
	background-position center
	background-size cover
	background: url("../../assets/images/left-tupple.gif") no-repeat center;
.fixed-bar{
	width: 100%;
    text-align: center;
    color: #666;
    margin: 0 auto;
    z-index: 8;
    position: fixed;
    bottom: 0;
}
.fixed-bar li {
    display: inline-block;
	position: relative;
}
.fixed-bar li i {
	position: absolute;
    right: 4px;
    top: 10px;
}
.fixed-bar .drop-down select {
	width: 50px;
}
.fixed-bar .drop-down {
    border-radius: 5px;
    border: 1px solid #eee;
    height: 28px;
    margin-left: 5px;
    font-size: 0.75em;
    background: #fff;
    color: #777;
    line-height: 28px;
    padding-left: 10px;
    margin-right: 5px;
}
.fixed-bar input {
	font-size: 18px;
	width: 120px
}
.online_booking{
	background-color: #ea2330;
	padding: 10px;
	border-radius: 3px;
	width: 100%;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.01);
	text-align: center;
	color: #fff;
	line-height: 20px;
	font-size: 14px;
}
.calender_div {
    overflow-y: scroll;
    height: 377px;
    position: absolute;
    left: -25px;
    top: 57px;
}
.calender_div:before {
    content: "";
    position: absolute;
    top: 27px;
    right: 120px;
    margin-left: -5px;
    border-width: 12px;
    border-style: solid;
    border-color: transparent transparent #e2e2e2;
    z-index: 99;
}
.over-h {
	overflow: hidden;
}
.over-h button{
	color: #1976d2;
	margin-right: 10px;
}
    .cal-m {
        z-index: 999;
    }
	.resp {
		background-size: cover;
	}
	.disabled {
		background-color : #cccccc !important ;
		cursor : no-drop	
	}
	.snack.snack--active.snack--bottom .btn.btn--flat{
		color: #fff!important;
	}
	.snack .close-snack {
		position: relative;
		right: -20px;
	}
</style>

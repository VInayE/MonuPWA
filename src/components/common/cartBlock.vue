<template>
    <v-app name="monument-cart-block" class="bg-white">
        <v-toolbar class="monument-header">
            <v-layout row wrap class="nav-back">
                <v-flex xs1 class="header_arrow_back" @click="chooseBackPath()">
                    <v-icon class="lh45">arrow_back</v-icon>
                </v-flex>
                <v-flex xs9 class="lh15 monuCount fs16">
                    <v-layout row wrap>
                        <v-flex xs12 fs14>
                            Travel Cart ({{cartLength}}
                             <span v-if="cartLength > 1">monuments)</span>
                            <span v-if="cartLength <= 1">monument)</span>

                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-toolbar>
        <v-tabs v-if="getItemLoader" class="loading-block">
            <v-tabs-items class="loading-screen">Loading Cart<span class="loader-icon"></span></v-tabs-items>
        </v-tabs>
        <v-card v-bind:style="!getItemLoader ? showItems : hideItems">
            <v-container
                fluid
                style="min-height: 0;"
                grid-list-lg>
                <v-layout row wrap v-for="(monument, index) in cartDetailData"
                            :key="index"
                            v-if="cartDetailData.length > 0">
                    <v-flex xs12>
                            <v-layout row wrap>
                            	<v-flex xs6 class="m-image">
                            		<img :src="monument.imagesInfo[0].url" class="img-resp">
                            	</v-flex>
                            	<v-flex xs6>
                            		<p class="">{{monument.shortTitle}}</p>
                            		 <small class="c-grey">{{monument.cityName || ""}}</small>
                            	</v-flex>
                            </v-layout>
                    </v-flex>
                    <v-flex xs12>
                    	<v-layout row wrap class="left-monu-info">
                               <v-flex xs5 @click.prevent="navigateCalender(monument.timings, index)" class="cal-range">
                              		 <v-icon class="cal-m">date_range</v-icon>
                               		 <input
                                        class="book_now_calender" 
                                        @input="navigateCalender(monument.timings, index)" 
                                        type="text" 
                                        placeholder="" 
                                        :value="findDisplayDate(new Date(Date.parse(ddate[index])), index)">
                               </v-flex>
                               <v-flex xs3 fs14 drop-down prel v-if="monument.timings.timeSlots">
                              		 <select type="text"
                                        v-model="form.timingbox_index[index]"
                                        v-on:change="populate(index, monument.id)">
                                            <option v-for="(timeslot, index) in monument.timings.timeSlots"
                                                :key="index"
                                                :value="timeslot.name + '__' + timeslot.startTime + '__' + timeslot.endTime">
                                                {{ timeslot.name }}
                                            </option>

                                    </select>
                               </v-flex>
                                <v-flex xs4 fs14 remove>
                              		 <div @click.prevent="deleteItem(index, monument.id)" class="red-c">Remove</div>
                               </v-flex>
						</v-layout>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
        <div xs12 v-if="cartLength==0 && !getItemLoader" class="txt-c">
            <img src="../../assets/images/shopping-bag.png">
			<div class="no-msg">No Monuments in your Travel Cart!</div>
            <div class="btn-red add-btn" @click="navigateToSrp()">Add Monument</div>
        </div>
        <v-flex class='bottom-btn fixed-bottom' v-if="cartLength > 0">
            <div class="btn-red add-monu" @click="navigateToSrp()">Add Monument</div>
            <div @click="proceedCheckout()" class="btn-red">
                    Proceed to checkout
            </div>
        </v-flex>
        <loader-view v-if="ajaxLoadingDialog"></loader-view>
        <v-snackbar :timeout="timeout" :bottom=" y === 'bottom'" :multi-line="true" v-model="snackbarInfo">
		    {{snackbarInfoMsg}}
		    <v-btn flat class="txt-ff close-snack" @click.native="snackbarInfo = false">Close</v-btn>
	    </v-snackbar>
    </v-app>
</template>

<script>
    import {
        fetchMasterDataAPI,
        fetchMonumentListDataAPI,
        getCompleteMonumentListData,
        getMasterDataFromJSON,
        getMonumentListDataFromJSON,
        checkUserProfile, 
        retrieveCartAPI,
        getCartItems,
        deleteMonumentFromCartAPI,
        checkMonumentAvailabilityAPIPost,
        fetchMonumentDetailsDataAPI,
        saveAdditionalDetails
    } from '../../api/api'
    import LoaderView from './loader'
    import {URLKEY} from '../../util/constants'
    import * as types from '../../store/types'
    /*import { adobeAnalyticsPageView } from '../helper/adobeAnalytic'*/
    import axios from 'axios'
    export default {
        name : 'cart-block',
        components:{
            AskModal: () => import("./askModal.vue"),
            LoaderView : () => import('./loader.vue')
        },
        data () {
            return {
                showItems :{
                    display:'block'
                },
                hideItems : {
                    display:'none'
                },
                ddate: [],
                userName: '',
                userEmail: '',
                cartLength: 0,
                userMobile: '',
                isLoggedIn: false,
                cartDetailData: [],
                getItemLoader: true,
                showCalenderDiv: [],
				monumentObjToPost: {},
                form: {
					timingbox_index: []
				},
				closedDays : {
					'SUNDAY':0,
					'MONDAY':1,
					'TUESDAY':2,
					'WEDNESDAY':3,
					'THURSDAY':4,
					'FRIDAY':5,
					'SATURDAY':6
                },
                ajaxLoadingDialog: false,
                cartId: '',
                itemCount: '',
                timeout: 1500,
				y: 'bottom',
				snackbarInfo: false,
				snackbarInfoMsg: ''
            }
        },
        mounted (){
            let isLoggedIn = localStorage.getItem("isLoggedIn")
            if(isLoggedIn) {
                this.retrieveCart()
            }
            else {
                this.checkUser()
            }
        },
        methods : {
            chooseBackPath() {
                if(this.$store.getters.getCartBackRoute == 'srp') {
                    this.$router.push({
                        name: 'MonumentSRPView'
                    })
                }
                if(this.$store.getters.getCartBackRoute == 'detail') {
                    let id = localStorage.getItem('monument_Id');
                    this.$router.push({path: '/pwa/monuments/details', query: { monumentId: id }})
                }
                else {
                    this.$router.push({
                        name: 'MonumentSRPView'
                    })
                }            
            },
            navigateToSrp(){
                this.$router.push({
                    name: 'MonumentSRPView'
                })
            },
            checkUser() {
                var self = this
                let userLoginParams= {
                    includeOptionalParams:true,
                    channel:'B2C',
                    productId:'yatrapwamonuments'
                }
                checkUserProfile(userLoginParams).then(function(userInfo) {
                    if(userInfo.data.status == 'FAIL') {
                        this.$router.push({name:'LoginView'})
                    }
                    else {
                        self.isLoggedIn = true
                        self.userEmail= userInfo.data.responseData.userInfo.email
                        self.userMobile= userInfo.data.responseData.userInfo.mobile
                        self.userName= userInfo.data.responseData.userInfo.name + " " + userInfo.data.responseData.userInfo.lastName
                        
                        // updating local store
                        localStorage.setItem("isLoggedIn", self.isLoggedIn)
                        localStorage.setItem("userEmail", self.userEmail)
                        localStorage.setItem("userMobile", self.userMobile)
                        localStorage.setItem("userName", self.userName)
                        self.$store.commit('setUserInfoData',userInfo.data.responseData.userInfo)
                        if(self.isLoggedIn) {
                            self.retrieveCart()
                        }
                    }
                }).catch(function (error) {
                    //self.retrieveCart()
                    console.log('Something wrong with checkApi request')
                })
            },
            retrieveCart() {
                var self = this
                retrieveCartAPI().then(response => {
                    self.cartId = response.data.cartId
                    self.itemCount = response.data.itemCount
                    self.cartLength = self.itemCount
                    localStorage.setItem("cartId", self.cartId)
                    localStorage.setItem("itemCount", self.itemCount)
                    self.getCartItemsCall(self.cartId)
                }).catch(error => {
                    console.log(error, 'Issue with retrieve cart API')
                })
            },
            getCartItemsCall(cartId) {
                var self = this
                if(cartId) {
                    getCartItems(cartId).then(response => {
                        self.cartDataId = response.data.itemList
                        self.fetchingMonumentDetails(self.cartDataId)
                        self.getItemLoader = false
                    }).catch(error => {
                        self.getItemLoader = false
                        console.log(error, "cart can't be fecthed")
                    })
                }
                else {
                    console.log('There has been some issue with cart ID')
                }
            },
            convertIntoHTML(txt) {
				var t =  new DOMParser().parseFromString(txt,'text/html').body
				return t.innerText
            },
            // addTiming(timings) {
            //     this.$store.commit('setMonumentTimings',timings)
            // },
            navigateCalender(timings, index)  {
                // transfer path to load cartblock back viqa calender
                localStorage.setItem("transferPath", "cartBlock")
                this.$store.commit('setMonumentTimings',timings)
                this.$store.commit('setCurrentCalIndex',index)
                localStorage.setItem('cuurentItemId', this.cartDataId[index].itemId)
                this.$router.push({name:'Calender'})
            },
            findDisplayDate(date, index){
                //calender touch for showing dates for the first time
                var self = this
                //console.log('date',date, Date.parse(self.ddate[index]))
                if(date) {
                    let date = new Date(self.ddate[index]).getDate() +'/'+ 
                        parseInt(parseInt(new Date(self.ddate[index]).getMonth())+1) +'/'+
                        new Date(self.ddate[index]).getFullYear()
                    self.monumentObjToPost[self.cartDetailData[index].id].visitDate = Date.parse(self.ddate[index])
                    return date
                }
            },
            defaultsToTimeSlots() {
				var _self = this
				// By default first time slot is added
				for(var a = 0; a < _self.cartDetailData.length; a++) {
					_self.$set(_self.showCalenderDiv, a, false);
					_self.monumentObjToPost[_self.cartDetailData[a].id] = {}
					if(_self.cartDetailData[a].timings && _self.cartDetailData[a].timings.timeSlots != undefined) {
						_self.monumentObjToPost[_self.cartDetailData[a].id].timeSlot  = _self.cartDetailData[a].timings.timeSlots[0]
						_self.monumentObjToPost[_self.cartDetailData[a].id].visitDate = Date.parse(new Date(new Date().setDate(new Date().getDate()+1)))
					} else {
						this.monumentObjToPost[_self.cartDetailData[a].id].visitDate = Date.parse(new Date(new Date().setDate(new Date().getDate()+1)))
					}
					// update initial values in Monument object
					if(_self.cartDataId[a].additionalDetails && _self.cartDataId[a].additionalDetails.timeSlotSelected != '' && _self.cartDataId[a].additionalDetails.timeSlotSelected != undefined) {
						let timeFSlot = _self.cartDataId[a].additionalDetails.timeSlotSelected.split('__')
						if(timeFSlot.length > 0) {
							var timeFSlotObj = {
								'name' : timeFSlot[0] || '',
								'startTime' : timeFSlot[1] || '',
								'endTime' : timeFSlot[2] || ''
							}
						}
						_self.monumentObjToPost[_self.cartDetailData[a].id].timeSlot = timeFSlotObj
					}
					if(_self.cartDataId[a].additionalDetails && _self.cartDataId[a].additionalDetails.dateSelected != '' && _self.cartDataId[a].additionalDetails.timeSlotSelected != undefined){
						_self.monumentObjToPost[_self.cartDetailData[a].id].visitDate = Date.parse(_self.cartDataId[a].additionalDetails.dateSelected)
					}
				}
			},
			fillingCalendar() {
                var _self = this
                let currentCartItemTimings = this.$store.getters.getCartItemTimings
                
				// Filling values for time slots
				_self.cartDetailData.map(function(monument, a){
                    
                    if(!currentCartItemTimings[a]) {
 5                        // pushing dates to cart block
                        if(_self.cartDataId[a].additionalDetails && _self.cartDataId[a].additionalDetails.dateSelected != '' && _self.cartDataId[a].additionalDetails.dateSelected != undefined) {
                            var date = _self.cartDataId[a].additionalDetails.dateSelected
                            var d1 = new Date();
                            var d2 = new Date(date);
                            // checking date coming should not be smaller than todays date
                            if(!(d1.getTime() >= d2.getTime())) {
                                _self.ddate.push(new Date(date))
                            } else {
                                _self.ddate.push(new Date(new Date().setDate(new Date().getDate()+1)))
                            }
                        }
                        else {
                            _self.ddate.push(new Date(new Date().setDate(new Date().getDate()+1)))
                        }
                    } else {
                        _self.ddate.push(currentCartItemTimings[a])
                    }
					
					// pushing time to time slots
					if(_self.cartDataId[a].additionalDetails && _self.cartDataId[a].additionalDetails.timeSlotSelected != '' && _self.cartDataId[a].additionalDetails.timeSlotSelected != undefined){
						_self.form.timingbox_index[a] = _self.cartDataId[a].additionalDetails.timeSlotSelected
					}
					else {
						if(_self.cartDetailData[a].timings.timeSlots != undefined) {
							_self.form.timingbox_index[a] = _self.cartDetailData[a].timings.timeSlots[0].name + '__' + _self.cartDetailData[a].timings.timeSlots[0].startTime + '__' + _self.cartDetailData[a].timings.timeSlots[0].endTime
						}
						else {
							_self.form.timingbox_index[a] = '____'
						}
					}
                })
                _self.$store.commit('setCartItemTimings',_self.ddate)
                // if(currentCartItemTimings.length <= 0) {
                //     _self.$store.commit('setCartItemTimings',_self.ddate)
                // }
                // else {
                //     _self.ddate = currentCartItemTimings
                //     currentCartItemTimings.map(function(date, index){
                //         console.log('i am joker')
                //         console.log(date)
                //         if(date == new Date(new Date().setDate(new Date().getDate()+1))) {
                //             console.log(date)
                //         }
                //     })

                // }
            },
            populate(index, id) {
				let timeFSlot = this.form.timingbox_index[index].split('__')
				if(timeFSlot.length > 0) {
					let timeFSlotObj = {
						'name' : timeFSlot[0] || '',
						'startTime' : timeFSlot[1] || '',
						'endTime' : timeFSlot[2] || ''
					}
					this.monumentObjToPost[id].timeSlot = timeFSlotObj
				}
				else {
					console.log("please check the time slots")
				}
				let cartId = localStorage.getItem('cartId')
				let itemId = this.cartDataId[index].itemId
				let itemDetails = {
					timeSlotSelected : this.form.timingbox_index[index]
				}

				saveAdditionalDetails(cartId, itemId, itemDetails).then(response => {
					console.log("item updated")
				}).catch(function(error){
					console.log(error, "can't update")
				})
			},
            fetchingMonumentDetails(cartDataId) {
                var _self = this
                var handleRequest = _self.cartDataId.map(function(monument, index) {
                    var monument = monument
				    return (fetchMonumentDetailsDataAPI(monument.productId).catch(error => {
					    _self.failedMonuments.push(error.response.data.responseInfo.message)
					    //Promise.reject();
					}))
                })
                // Fetching monuments details
                axios.all(handleRequest).then(response => {
                    (response.map(function(responseData, index){
                        if(responseData != 'undefined' && responseData != undefined) {
                                _self.cartDetailData.push(responseData.data.data);
                        }
                    }))
                    _self.defaultsToTimeSlots()
                    _self.fillingCalendar()
                    _self.detailsUploader = true
                })
            },
            getDate (date) {
				var d = new Date(date)
				return (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())
            },
            pullingItemId(id) {
				var self = this
				var exactItem = self.cartDataId.filter(function(item, index){
					return (item.productId == id)
				})
				var exactItemId = exactItem.map(function(item, index){
					return item.itemId
				})
				return exactItemId
			},
            deleteItem(index, id) {
                var self = this
				let deletedMonumentID = id
				let deletedItemId = this.pullingItemId(deletedMonumentID)
				let cartId = localStorage.getItem('cartId')
				deleteMonumentFromCartAPI(deletedItemId, cartId).then(function(response) {
                    //console.log(response)
                    if(response.data.status == true) {  
                        self.cartDetailData.splice(index,1);
                        self.ddate.splice(index,1)
                        self.$store.commit('setCartItemTimings',self.ddate)
                        self.cartLength = self.cartDetailData.length
                        delete self.monumentObjToPost[id]
                        self.snackbarInfo = true
                        self.snackbarInfoMsg = response.data.message
                    } else {
                        self.snackbarInfo = true
                        self.snackbarInfoMsg = response.data.message
                    }
                }).catch(function(error) {
                    self.snackbarInfo = true
                    self.snackbarInfoMsg = "Delete isn't responding"
                    console.log('errorDelete', error)
                })                
			},
            proceedCheckout() {
                let self = this
                self.ajaxLoadingDialog = true
				checkMonumentAvailabilityAPIPost(this.monumentObjToPost).then(response => {
					self.isAPICompleted = false
					if(response.data.data.monumentsAvailability) {
						self.bookingSuperPNR = response.data.data.superPnr
						var monuJSON = JSON.stringify(response.data.data)
						// Saving required values to local storage
						localStorage.bookingMonuResponse = monuJSON
                        localStorage.setItem('superPnr', self.bookingSuperPNR)
						var intialURL = process.env.NODE_ENV === 'production' ? 'https://secure.yatra.com' :'http://yatra.com'
                        //window.open(intialURL+`${BASE_URL}/review?superPNR=${self.bookingSuperPNR}`,"_self")
                        self.$router.push({ name: "AddTravellersView" });
					} else {
						console.log('something went wrong with response')
					}
				}, response => {
					//self.isAPICompleted = true
                    //self.showTravellerDetails = false
                    self.ajaxLoadingDialog = false
                    self.snackbarInfo = true
                    if(response && response.response && response.response.data && response.response.data.responseInfo && response.response.data.responseInfo.errors) {
                        self.snackbarInfoMsg = response.response.data.responseInfo.errors
                    } else {
                        self.snackbarInfoMsg = "Can't proceed"
                    }
					console.log('something went wrong !!')
				});
			}
        }
    }
</script>

<style lang="scss" scoped>
	.loading-block {
		position: absolute;
		top: 200px;
		left: 100px;
	}
    .loading-screen{
        .loader-icon{
            height: 24px;
            width: 24px;
            display: inline-block;
            background: url("../../assets/images/left-tupple.gif") no-repeat center;
			position: relative;
			top: 6px;
			left: 5px;
        }
    }
    .cal-m {
        z-index: 999;
    }
    .m-image {
        width: 50%;
        img {
            border-radius: 5px;
            min-height: 100px;
            background: url("../../assets/images/left-tupple.gif") no-repeat center;
        }
    }
    .left-monu-info {
        padding: 5px;
        li {
            display: inline-block;
            vertical-align: top;
            width: 49%;
            input {
                width: 100px
            }
        }
		.flex {
			padding-top: 0 !important;
		}
    }
    .monu-tuple{
        margin-bottom: 5px;
    }
	.nav-back {
		margin-left: 0 !important;
	}
	.cal-range {
		font-size: 14px;
		input {
			width: 70%;
		}
	}
		.btn-red {
		background: #ea2330;
		padding: 10px;
		color: #fff;
		margin-top: 10px;
		text-align: center;
		text-transform: capitalize;
			border-right: 1px solid #fff;
		}
	.fixed {
		position: fixed;
		width: 100%;
		bottom: 0;
	}
	.card {
		box-shadow: none;
		margin-top: 8px;
		margin-bottom: 20px;
	}
	.monument-header {
		border-bottom: 1px solid #eee;
	}
	.grid-list-lg {
		>.layout{
		border-bottom: 1px solid #eee;
    	margin-bottom: 10px !important;
		}
	}
	.red-c{
		color: #ea2330;
		text-align: right;
	}
	.drop-down {
		border-radius: 5px;
		border: 1px solid #eee;
		height: 26px;
		font-size: .75em;
		background: #fff;
		color: #777;
		line-height: 24px;
	}
	.remove {
		position: absolute;
		right: 10px;
	}
	.bg-white {
		background: #fff;
	}
	.txt-c {
		text-align: center;
	}
	.add-btn {
		    width: 150px;
    margin: 8px auto;
    border-radius: 3px;
    padding: 8px;
	}
	.no-msg {
		margin: 15px 0;
	}
	.fixed-bottom {
		position: fixed;
		bottom: 0;
		width: 100%;
		font-size: 14px;
	}
    .bottom-btn div {
        width: 50%;
        float: left;
    }
</style>

<template>
	<v-app>
		<div class="fixed">
			<v-toolbar v-if="showCalenderToolbar">
				<v-layout row wrap class="nav-bar side-padding">
					<v-flex xs2 @click="navigateToDetails"><v-icon>arrow_back</v-icon></v-flex>
					<v-flex xs8>Select Date</v-flex>
				</v-layout>
			</v-toolbar>
			<!--<ul class="days">
				<li>Mon</li>
				<li>Tue</li>
				<li>Wed</li>
				<li>Thu</li>
				<li>Fri</li>
				<li>Sat</li>
				<li>Sun</li>
			</ul>-->
			</div>
			<div class="calender prel">
			<div class="calender_div" v-if="showCalender">
				<div class="date-arrow" >
					<div v-for="(calender,index) in calenderLength" :key='index'>
						<datepicker  :full-month-name="true" 
							:maximum-view="'day'" 
							v-on:selected="changeDateOnSelection($event,index)" 
							v-bind:class="{ selectedDate:getSelectedDateIndex(index), unselectedDate : getSelectedDateIndex(index) }"
							:value="calculateDate(index)" 
							:inline="true" 
							:monday-first="true" 
							:disabled="index == 0 ? state.disabled:state.disabled_2 " 
							class="input-grp date_picker">
						</datepicker>
					</div>
				</div>
			</div>
			<i class="ico-sprite ico-cal"></i>
		</div>
	</v-app>
</template>
<script>
	import { mapGetters, mapMutations } from 'vuex'
	import * as types from '../store/types'
	import Datepicker from 'vuejs-datepicker'
	import router from '../router'
	import Vue from 'vue'
	import {saveAdditionalDetails} from '../api/api'
	export default {
		components: {
			Datepicker
		},
		mounted() {
			var self = this
			var tranfer = localStorage.getItem('transferPath')
			if(tranfer == 'cartBlock') {
				this.closingTimings = this.$store.getters.getMonumentTimings
				//this.selectedCalenderIndex = this.$store.getters.getCurrentCalIndex
				let mainIndex = this.$store.getters.getCurrentCalIndex
				let currentCartItemTimings = this.$store.getters.getCartItemTimings
				this.ddate = currentCartItemTimings[mainIndex]
				//console.log(this.ddate)
			}
			else{
				this.closingTimings = this.$store.getters.getMonumentTimings
			}
			if(!(Object.keys(this.closingTimings).length > 0)) {
				self.navigateToDetails()
			}
			for(let i=0 ; i < this.closingTimings.closedDays.length ; i++){
				this.state.disabled.days.push(this.closedDays[this.closingTimings.closedDays[i]])
				this.state.disabled_2.days.push(this.closedDays[this.closingTimings.closedDays[i]])
			}
			for(let i=0 ; i < this.closingTimings.holidays.length ; i++){
				this.state.disabled.dates.push(new Date(this.closingTimings.holidays[i]))
				this.state.disabled_2.dates.push(new Date(this.closingTimings.holidays[i]))
			}
			this.state.disabled_2.from = new Date(this.closingTimings.maxDate)
			this.calenderLength =  this.monthDiff(new Date(), new Date(this.closingTimings.maxDate)) +2
		},
		data() {
			return {
				calenderLength: 12,
				selectedCalenderIndex: this.$store.getters.getCalenderIndex,
				showCalender: true,
				closingTimings: {},
				showCalenderToolbar:true,
				closedDays : {
					'SUNDAY':0,
					'MONDAY':1,
					'TUESDAY':2,
					'WEDNESDAY':3,
					'THURSDAY':4,
					'FRIDAY':5,
					'SATURDAY':6 
				},
				ddate: this.$store.getters.getTimings,
				state: {
					disabled: {
						days: [],
						to: new Date(new Date().setDate(new Date().getDate() - 1)),
						dates: []
					},
					disabled_2: {
						days: [],
						from: '',
						dates: []
					}
				}
			}
		},
		methods: {
			getSelectedDateIndex(index1){
			   let date1 = new Date()
			   let date2 = date1.setMonth(date1.getMonth()+index1)
			   date2 = new Date(date2)
			   if(new Date(this.ddate).getMonth() == date2.getMonth()){
				   return false
			   }else{
				   return true
			   }
			},
		 	monthDiff(d1, d2) {
				var months;
				months = (d2.getFullYear() - d1.getFullYear()) * 12;
				months -= d1.getMonth() + 1;
				months += d2.getMonth();
				return months <= 0 ? 0 : months;
			},
			calculateDate(index) {
				// if (index == this.selectedCalenderIndex) {
				// 	return this.ddate
				// } else {
				// 	var today = new Date(new Date().setDate(new Date().getDate() + 1))
				// 	return new Date(today.getFullYear(), today.getMonth() + index, new Date(this.ddate).getDate())
				// }
				var today = new Date(new Date().setDate(new Date().getDate() + 1))
				return new Date(today.getFullYear(), today.getMonth() + index, new Date(this.ddate).getDate())
			},
			findDisplayDate(date) {
				return date.getDate() + '/' + parseInt(parseInt(date.getMonth()) + 1) + '/' + date.getFullYear()
			},
			navigateToDetails() {
				var id = localStorage.getItem('monument_Id');
				var tranfer = localStorage.getItem('transferPath')
				if(tranfer == 'cartBlock') {
					this.$router.push({name:'CartBlock'})
				}
				else {
					this.$router.push({path: '/pwa/monuments/details', query: { monumentId: id }})
				}
			},
			changeDateOnSelection(event, index) {
				this.ddate = event
				//console.log(event, new Date(event))
				this.selectedCalenderIndex = index
				var tranfer = localStorage.getItem('transferPath')
				if(tranfer == 'cartBlock') {
					let mainIndex = this.$store.getters.getCurrentCalIndex
					let currentCartItemTimings = this.$store.getters.getCartItemTimings
					currentCartItemTimings[mainIndex] = new Date(event)
					let currentItemId = localStorage.getItem('cuurentItemId')
					let cartId = localStorage.getItem('cartId')
					let itemDetails = {
						dateSelected : (new Date(event))
					}
					if(cartId && currentItemId) {
						saveAdditionalDetails(cartId, currentItemId, itemDetails).then(response => {
							console.log("item updated")
						}).catch(function(error){
							console.log(error, "can't update")
						})
					}
					this.$store.commit('setCartItemTimings', currentCartItemTimings)
				}
				this.$store.commit('setTimings',this.ddate)
				//this.setUpdatedDate(this.ddate)
				this.navigateToDetails()
			},
			getDate (date) {
				var d = new Date(date)
				return (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())
		   }
		}
	}

</script>
<style  scoped lang="scss">
.calender {
	margin-top: 58px;
		.calender_div {
			.date-arrow {
				overflow-y: auto;
				overflow-x: hidden;
				width: 100%;
				box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.11);
				top: 50px;
				z-index: 9;
				margin-top: 10px;
				box-shadow: none!important;
			}
		}
		.date_picker {
			background: none!important;
			border: 0px !important;
			margin-top: 0px!important;
			height: 100%!important;
		}
		.date-txt {
			float: left;
			margin-top: 8px;
			color: #666666;
			font-size: 14px;
		}
	}
	.days{
		background: #F5F5F5;
		padding: 0px;
		margin-top: 10px;
		box-shadow: none;
		width: 100vw;
		display: flex;
		li {
			display: inline-block;
			list-style-type: none;
			width: calc(100vw / 7);
			text-align: center;
			padding: 10px;
			color: #9E9E9E;
		}
	} 
	.fixed {
		position: fixed;
		top: 0;
		z-index: 9;
		background: #fff;
		width: 100%;
	}
	.nav-bar {
		margin-left: 16px !important;
	}
	.vdp-datepicker__calendar .cell.selected.disabled {
		background: transparent !important;
		color: #ddd !important;
	}
</style>

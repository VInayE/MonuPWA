<template>
	<div class="monument-ticket brd-btm">
		<h1 class="heading-txt">Ticket Value</h1>
		<ul class="ticket-info">
			<li class="" v-if="booking_allowed">
			   <div v-for="(priceInformation,index) in Object.keys(price_info).length" :key="index" class="mb15">
				  {{Object.keys(price_info)[index]}} Visitor:<br>
					<strong>Total  &#8377 {{price_info[Object.keys(price_info)[index]].adult.totalPrice}}</strong><br>
					<span>&#8377 {{price_info[Object.keys(price_info)[index]].adult.asi}}/- by ASI as Entry fee {{price_info[Object.keys(price_info)[index]].adult.lda == 0 ?'' : '& &#8377' +price_info[Object.keys(price_info)[index]].adult.lda +'/- by ADA as Toll tax' }}</span>
			   </div>
		   </li>
			<li class="d-iblock txt-l ml10 tic-desc txt-l" v-if="!booking_allowed">
			   <div>
					Non Ticketed <br>
					<strong>Free Entry</strong><br>
					<span>For all visitors.</span>
			   </div>
		   </li>
		</ul>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				isAPICompleted:false,
				booking_allowed: false,
				price_info : {}
			}
		},
		props: ['monumentPriceInfo','bookingAllowed'],
		created (){
		  this.booking_allowed = this.bookingAllowed
		  this.price_info = this.monumentPriceInfo
		}
	}
</script>
<style scoped lang="stylus">
.monument-ticket 
	margin 0px 16px 0 16px
	.ticket-info 
		strong 
			font-size 20px
			font-weight normal
			color #2788E6
		span 
			font-size 14px
			color #666

</style>

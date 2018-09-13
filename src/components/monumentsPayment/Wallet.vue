<template>
     <v-dialog v-model="walletDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-toolbar dark class="white cd_fixed_header">
            <v-btn icon @click.native="closeWalletDialog" dark style="margin-left:0px;">
                    <v-icon class="cl_white_back payment_back">arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title class="cd_header_white header_white">Wallet</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark flat @click.native="closeCreditDialog"></v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-layout class="wallet bg-white" row wrap>
            <v-snackbar class="snacktxt" :timeout="timeout" :bottom="y === 'bottom'" v-model="snackbar">
            Please Select Your Bank
            <v-btn flat class="txt-ff" @click.native="snackbar = false">Close</v-btn>
            </v-snackbar>
            <v-flex xs12 p10>
            <div class="tabs" v-for="(item,index) in walletOption.suboptionList" v-bind:class="{lastTab:walletOption.suboptionList % 2 == 0}" @click="bankcode = item.subOption" v-if="item.status==='ENABLED'"  :key="index">
              <span class="left radio-btn prel">
                <v-radio-group v-model="bankcode" row>
                    <v-radio class="tab-bank tab-bank-wallet" :value="item.subOption" color="primary" :id="item.subOption"></v-radio>
                </v-radio-group>
                </span>
                <span class="left w100"><img :src="createImageURL(item.subOption)" v-bind:alt="item.url" class="img-resp"></span>
            </div>
            </v-flex>
            <v-flex v-if="!walletOption.suboptionList">
                We are currently not serving payment through Wallet. Please try any other mode.
            </v-flex>
            <v-flex xs12 p-20 content>
	          <p>We will redirect you to corresponding wallet page where you can make payment.</p>
	          <p>As per government norms, non-KYC customers can pay a maximum of <span>&#8377;</span> 20,000 in a month using wallets.</p>
            </v-flex>
         </v-layout>
         <loader-view v-if="ajaxLoadingDialog"></loader-view>
         <div class="pricefixed"><button class="btn" @click.stop="makePayment">PROCEED TO PAY ₹ {{totalPrice}} </button></div>
    </v-dialog>
</template>
<script>
  import { mapGetters} from 'vuex'
  import * as types from '../../store/types'
  import {makePaymentCall} from '../../helper/payment'
  import LoaderView from '../common/loader'
  import {dateFormat} from '../../helper/pwaMonumentsHelper' 
  import axios from 'axios'
  import qs from 'qs'
	
  export default {
      props:['openWalletDialog', 'walletOption','redeemedamount','superPNR'],
      components:{
         LoaderView  
      },
      data(){
          return {
              walletDialog: false,
              ajaxLoadingDialog:false,
              createOrderResponse : {},
              bankcode: '',
              tDate: '',
              totalPrice: '',
              snackbar: false,
              y: 'bottom',
              timeout: 3000
          }
      },
       watch:{
       openWalletDialog(){
           this.walletDialog = this.openWalletDialog
           this.createOrderResponse = this.superPNR
       }
     },
     mounted () {
        this.createOrderResponse = this.superPNR
        this.tDate = localStorage.getItem('availableDate')
        this.totalPrice = localStorage.getItem('setMonumentPrice')
     },
     methods: {
		   createImageURL(url){
			 return require('../../assets/images/icons/'+ url + ".png")
           },
           makePayment() {
             if(this.bankcode == ''){
                 this.snackbar = true
                 return false
             } else{
                this.paySwiftCall();
             }
           },
           tdateFill (date) {
               return dateFormat(date)
           },
           closeWalletDialog () {
             this.$emit('closeWalletDialog', false)
           },
           paySwiftCall(){
              let self = this
              this.ajaxLoadingDialog = true
                var payDetails={
                    'patternMatch': new RegExp('^[1-9][0-9]?$'),
                    'paymentModeType':'FULL',
                    'paymentAmount':localStorage.getItem('setMonumentPrice'),
                    'tdate': this.tdateFill(this.tDate),
                    'payOptionType':'mw',
                    'bankcode':this.bankcode,
                    'productCode': 'yatrapwamonuments'
                }
				let payswiftCardParams ={
					amountDisplayed:payDetails.paymentAmount,
					eCashRedemed:this.redeemedamount,
					appVersion:'1.0',
					client:'APP',
					discount:0,
					discountingStatus:false,
					email:localStorage.getItem("setUserInfoDataEmail"),
					merchant:'yatra',
					mob:localStorage.getItem('setUserInfoDataMob'),
					otherDiscountingStatus:false,
					paymentMode:payDetails.paymentModeType,
					paymentOptionParameters:'tdate='+payDetails.tdate+'|merchant=yatra|product='+
					payDetails.productCode+'|payop='+payDetails.payOptionType+'|bankCode='+
					payDetails.bankcode
					+'|prBank='+payDetails.bankcode+'|client=APP|uuid='+
					Date.parse(new Date),
					product:payDetails.productCode,
					promoCode:'',
					promoType:'',
					superPnr:localStorage.getItem('superPnr'),
					ttid:parseInt('11'+localStorage.getItem('superPnr')),
					uuid:Date.parse(new Date),
					amountToRedeem:0
				}
				axios.post('https://www.yatra.com/PaySwift/payNow',
				qs.stringify(payswiftCardParams),
				{headers : {
                    'Content-type': 'application/x-www-form-urlencoded',
                    'com.yatra.tenant.header.tenantId':5403,
					'YT-CHANNEL' : 'PWA',
					'YT-TENANT-CODE' : 'yatrapwamonuments',
				}}).then(function (response) {
					makePaymentCall(response.data)
					self.ajaxLoadingDialog = false
				})
             }
        }
  }
</script>
<style scoped>
     .content{
        padding-top: 0px;
        color: rgb(117, 117, 117);
        font-size: 14px;
        margin-top:-70px
     }
     .pricefixed {
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
        background-color: rgb(234, 35, 48);
        height: 43px;
        font-size: 14px;
        font-weight: bold;
    }
    .wallet .tabs {
        width: 50%;
        float: left;
        border: 1px solid #ccc;
        padding: 0 8px;
        height:56px;
    }
    .tab-bank {
        padding: 12px 0;
    }
    .wallet .w100 {
        width: 100px;
        margin-top: 13px;
        position: relative;
        left: 10px;
    }
    .wallet .w100>img{
       width:inherit;
       height:auto;
    }
    .p10 {
        padding: 10px;
    }
    .p20 {
        padding: 20px;
    }
     .wallet .lastTab:last-child{
       width: 100%;
       border-bottom: 2px solid #ccc;
     }
    .tab-bank i {
        color: #000;
    }
    .wallet .input-group {
        padding-top: 0;
    }
    .p-20{
      padding: 0 20px;
    }
</style>

<template>
     <v-dialog v-model="netDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-toolbar dark class="white cd_fixed_header">
            <v-btn icon @click.native="closeNetDialog" dark style="margin-left:0px;">
                    <v-icon class="cl_white_back payment_back">arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title class="cd_header_white header_white">Net Banking</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark flat @click.native="closeCreditDialog"></v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <div class="white">
            <v-layout row wrap class="default-bank">
            <v-snackbar class="snacktxt" :timeout="timeout" :bottom="y === 'bottom'" v-model="snackbar">
            Please Select Your Bank
            <v-btn flat class="txt-ff" @click.native="snackbar = false">Close</v-btn>
            </v-snackbar>
            <v-flex xs12 p010 fb>Select your Bank</v-flex>
            <v-flex xs12 p10>
                <div xs6 class="tabs" v-for="(item,index) in popularBank" @click="bankcode = item.name">
                    <span class="left prel radio-btn">
                      <v-radio-group v-model="bankcode" row>
                            <v-radio class="tab-bank" color="primary" :value="item.name" :id="item.code"></v-radio>
                      </v-radio-group>
                    </span>
                    <span class="left w100"><img :src="createImageURL(item.url)" v-bind:alt="item.url" class="img-resp"></span>
                </div>
                </v-flex>
            </v-layout>
            <v-layout row wrap class="net-banking"> 
            <v-flex xs12 p010 fb>Or Choose Another Bank</v-flex>  
               <v-radio-group v-model="bankcode" row radio-btn>
                   <v-flex xs12>
                     <div class="tabs" v-for="(item,index) in netBankingOption.banks" @click="bankcode = item.code">
                       <v-radio class="tab-bank" :label="item.displayText" :value="item.code" color="primary" :id="item.code"></v-radio>
                    </div>
                </v-flex>
               </v-radio-group>
               
            </v-layout>
        </div>
        <loader-view v-if="ajaxLoadingDialog"></loader-view> 
        <div class="pricefixed"><button class="btn" @click.stop="makePayment">PROCEED TO PAY  ₹ {{totalPrice}} </button></div>
    </v-dialog>
</template>
<script>
  import { mapGetters,mapMutations } from 'vuex'
  import * as types from '../../store/types'
  import {makePaymentCall} from '../../helper/payment'
  import LoaderView from '../common/loader'
  import {dateFormat} from '../../helper/pwaMonumentsHelper' 
  import axios from 'axios'
  import qs from 'qs'
  
  export default {
      props:['openNetDialog','netBankingOption','redeemedamount','superPNR'],
      components:{
         LoaderView
      },
      data(){
          return {
              popularBank:[
                  {'name':'162','url':'162','code':'162'},
                  {'name':'ALB','url':'ALB','code':'ALB'},
                  {'name':'UTI','url':'UTI','code':'UTI'},
                  {'name':'CIT','url':'CIT','code':'CIT'},
                  {'name':'HDF','url':'HDF','code':'HDF'},
                  {'name':'icicinet','url':'icicinet','code':'icicinet'},
                  {'name':'IDB','url':'IDB','code':'IDB'},
                  {'name':'PNB','url':'PNB','code':'PNB'}
              ],
              netDialog: false,
              tDate: '',
              totalPrice: '',
              createOrderResponse:{},
              bankcode: '',
              snackbar: false,
              snackbarText:'',
              timeout: 3000,
              ajaxLoadingDialog: false,
              showPaymentDialog:false,
              paymentErrorMessage:{},
              y: 'bottom'
            }
          },
       mounted (){
         this.createOrderResponse = this.superPNR
         this.tDate = localStorage.getItem('availableDate')
         this.totalPrice = localStorage.getItem('setMonumentPrice')
       },     
       watch:{
       openNetDialog(){
           this.netDialog = this.openNetDialog;
           this.createOrderResponse = this.superPNR
       }
     },
      methods: {
		   createImageURL(url){
			 return require('../../assets/images/icons/'+ url + ".png")
           },
           makePayment () {
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
           closeNetDialog () {
             this.$emit('closeNetDialog', false)  
          },
          paySwiftCall(){
              let self = this
              this.ajaxLoadingDialog = true
            var payDetails={
                'patternMatch': new RegExp('^[1-9][0-9]?$'),
                'paymentModeType':'FULL',
                'paymentAmount':localStorage.getItem('setMonumentPrice'),
                'payOptionType':'nb',
                'bankcode':this.bankcode,
                'productCode': 'yatrapwamonuments',
                'tdate': this.tdateFill(this.tDate)
            }

			let payswiftCardParams ={
				amountDisplayed:payDetails.paymentAmount,
				eCashRedemed:this.redeemedamount,
				appVersion:'1.0',
				client:'APP',
				discount:0,
				discountingStatus:false,
				email:localStorage.getItem('setUserInfoDataEmail'),
				merchant:'yatra',
				mob:localStorage.getItem('setUserInfoDataMob'),
				otherDiscountingStatus:false,
				paymentMode:payDetails.paymentModeType,
				paymentOptionParameters:'tdate='+payDetails.tdate+'|merchant=yatra|product='+payDetails.productCode
				+'|payop='+payDetails.payOptionType+'|bankCode='+payDetails.bankcode+'|prBank='+payDetails.bankcode
				+'|client=APP|uuid='+Date.parse(new Date),
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
    .radio-btn {
        top: 12px;
    }
    .p20 {
        padding: 20px;
    }
    .tabs {
        border-bottom: 1px solid #ccc;
        padding: 0px 20px;
    }
    .tab-bank label {
    font-size: 14px;
}
    .default-bank .w100 {
        width: 100px;
        margin-top: 17px;
        position: relative;
        left: 10px;
    }
    .default-bank .tabs {
      width: 50%;
      float: left;
      border: 1px solid #ccc;
      padding: 0 8px;
      height: 56px;
    }
    .default-bank .tabs .img-resp{
        width:100%;
    }
    
    .p10 {
        padding: 10px;
    }
    .p010 {
        padding: 10px 10px 0 10px;
    }
    .fb {
       color: rgb(0,0,0);
       font-size: 16px;
       text-transform: capitalize;
       font-weight: 500;
    }
    .white {
        background: #fff;
    }
    .net-banking .tabs {
        padding: 20px;
        padding-top:27px;
    }
    .tab-bank i {
        color: #000;
    }
    .net-banking .input-group {
        padding-top: 0;
    }
</style>

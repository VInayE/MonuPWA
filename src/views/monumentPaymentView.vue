<template>
  <v-app class="cd_bg">

      <v-toolbar class="monument-header">
        <v-layout row wrap>
            <v-flex xs1 class="header_arrow_back">
                <v-icon @click="navigateToReview()">arrow_back</v-icon>
            </v-flex>
            <v-flex xs9 class="lh15 fs20"> Make Payment </v-flex>
        </v-layout>
      </v-toolbar>
      <!-- remove fare breakup - product call -->
      <div class="payment_view pt20 payment-price">
        <v-layout row wrap>
            <v-flex xs6 left class="fs-md">Total Price</v-flex>
            <v-flex xs6 right class="fs-md txt-r">₹ {{totalPrice}}
                <!-- <v-icon class="hv_info_icon" slot="activator" @click.stop="openfareInfoDialog">info_outline</v-icon> -->
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs6 left class="fs-md">Balance Payable</v-flex>
            <v-flex xs6 right class="fs-md txt-r">₹ {{totalPrice - availCash}}
                <!-- <v-icon class="hv_info_icon" slot="activator" @click.stop="openfareInfoDialog">info_outline</v-icon> -->
            </v-flex>
        </v-layout>
      </div>

      <div v-if="totalPrice - availCash">
        <v-layout row wrap sltpay>
            <v-flex xs12>Select Payment Option</v-flex>
        </v-layout>
      </div>

      <div class="payment-option payment_view">
          <!-- <div @click.stop="openSavedDialog = true" class="tabs"> Saved Cards <v-icon class="right">keyboard_arrow_right</v-icon></div>
          <saved-cards v-if="savedCardsData!=[]" :savedCardsOption="savedCardsData" :redeemedamount="availCash"
                       :superPNR="createOrderSuperPnr"
                       :openSavedDialog="openSavedDialog"
                       @closeSavedDialog="openSavedDialog = false"
                       @selectedSavedCards="selectedSavedCards($event)">
          </saved-cards> -->
          <div @click.stop="openCreditDialog = true" class="tabs">Credit Card <v-icon class="right">keyboard_arrow_right</v-icon></div>
          <credit-card v-if="CreditCardData!={}" :creditCardOption="CreditCardData" :redeemedamount="availCash"
                       :superPNR="createOrderSuperPnr"
                       :openCreditDialog="openCreditDialog"
                       @closeCreditDialog="openCreditDialog = false"
                       @creditCardDetails="creditCard($event)">
          </credit-card>
          <div @click.stop="openDebitDialog = true" class="tabs">Debit Card <v-icon class="right">keyboard_arrow_right</v-icon></div>
          <debit-card v-if="DebitCardOption!={}" :debitCardOption="DebitCardOption" :redeemedamount="availCash"
                       :superPNR="createOrderSuperPnr"
                       :openDebitDialog="openDebitDialog"
                       @closeDebitDialog="openDebitDialog = false"
                       @debitCardDetails="creditCard($event)">
          </debit-card>
          <div @click.stop="openNetDialog = true" class="tabs">Net Banking <v-icon class="right">keyboard_arrow_right</v-icon></div>
          <net-banking v-if="netBankingData!={}" :netBankingOption="netBankingData" :redeemedamount="availCash"
                       :superPNR="createOrderSuperPnr"
                       :openNetDialog="openNetDialog"
                       @closeNetDialog="openNetDialog = false"
                       @selectedNetBanking="selectedNetBanking($event)">
          </net-banking>
          <div @click.stop="openWalletDialog = true" class="tabs">Wallet <v-icon class="right">keyboard_arrow_right</v-icon></div>
          <wallet v-if="walletData!={}" :walletOption="walletData" :redeemedamount="availCash"
                       :superPNR="createOrderSuperPnr"
                       :openWalletDialog="openWalletDialog"
                       @closeWalletDialog="openWalletDialog = false"
                       @selectedWalletCode="selectedWallet($event)"
          ></wallet>
          <!-- <div @click.stop="openEmiDialog = true" class="tabs">EMI Options <v-icon class="right">keyboard_arrow_right</v-icon></div>
          <emi-options v-if="emiData!={}" :emiOption="emiData" :redeemedamount="availCash"
                  :superPNR="createOrderSuperPnr"
                  :openEmiDialog="openEmiDialog"
                  @closeEmiDialog="openEmiDialog = false"
          ></emi-options> -->
      </div>

      <payment-error  :showPaymentDialog="showPaymentDialog" :paymentErrorMessage="paymentErrorMessage"></payment-error>
      <loader-view v-if="ajaxLoading"></loader-view>
      <div class="footerfixed">
          <img src="../assets/images/icons/secure_footer.png" class="footer-img">
      </div>

  </v-app>
</template>
<script>
import qs from 'qs'
import axios from 'axios'
import data from '../data/paymentdata.js'
import {makePaymentCall} from '../helper/payment'
import {dateFormat} from '../helper/pwaMonumentsHelper'
import CreditCard from '../components/monumentsPayment/CreditCard'
import paymentError from '../components/monumentsPayment/paymentError'
export default {
    components: {
        CreditCard,
        DebitCard : () => import('../components/monumentsPayment/DebitCard'),
        NetBanking : () => import('../components/monumentsPayment/NetBanking'),
        Wallet : () => import('../components/monumentsPayment/Wallet'),
        EmiOptions : () => import('../components/monumentsPayment/EmiOptions'),
        LoaderView: () => import('../components/common/loader'),
        paymentError
    },
    data() {
	  return {
         monumentReviewData: {},
         totalPrice: '',
         tDate: '',
         availCash: 0,
         showLoader:true,
         CreditCardData: {},
         DebitCardOption: {},
         openCreditDialog: false,
         openDebitDialog: false,
         fareInfoDialog: false,
         createOrderSuperPnr:'',
         createOrderResponse : {},
         netBankingData: {},
         openSavedDialog: false,
         openNetDialog: false,
         openWalletDialog: false,
         openEmiDialog: false,
         walletData: {},
         savedCardsData: data.paymentJson.storedCardJSON.quickBookCards,
         emiData: data.paymentJson.paymentOptionJSON.paymentOptions[4].banks,
         ajaxLoading :false,
         paymentErrorMessage:{},
         showPaymentDialog :false
	  }
    },
    created (){
        this.createOrderResponse = this.superPNR
    },
    methods : {
        tdateFill (date) {
            return dateFormat(date)
        },
        getPaymentJSON(superPNR){
            var paymentJsonUrl='';
            if (process.env.NODE_ENV && process.env.NODE_ENV.toString() === 'production') {
                paymentJsonUrl = 'https://www.yatra.com/';
            } else {
              paymentJsonUrl = 'http://yatra.com/';
            }
            var self = this
            var product = "yatrapwamonuments"
            var superPnrId = superPNR;
            axios.post(`${paymentJsonUrl}PaySwift/getPaymentInfo?merchantCode=yatra&productCode=${product}&client=APP&superPnr=${superPnrId}`).then(function (response) {
                var len = response.data.paymentOptionJSON.paymentOptions.length;
                var jList = response.data.paymentOptionJSON.paymentOptions
                if (process.env.NODE_ENV && process.env.NODE_ENV.toString() === 'production') {
                for (var i = 0; i < len; i++) {
                    if(jList[i].code=='cc') {
                        self.CreditCardData=  response.data.paymentOptionJSON.paymentOptions[i]
                       }else if(jList[i].code=='dc') {
                           self.DebitCardOption = response.data.paymentOptionJSON.paymentOptions[i]
                       }else if(jList[i].code=='nb') {
                           self.netBankingData = response.data.paymentOptionJSON.paymentOptions[i]
                       }else if(jList[i].code=='mw') {
                            self.walletData =  response.data.paymentOptionJSON.paymentOptions[i]
                       }
                    //    else if(jList[i].code == 'qb') {
                    //         self.savedCardsData =  this.response.data.storeCardJSON.quickBookCards
                    //         console.log(self.savedCardsData);
                    //    }
                }
                self.eCashJSON = response.data.eCashJSON
            }else{
                let dummyData
                for (var i = 0; i < len; i++) {
                    if(jList[i].code=='cc') {
                        self.CreditCardData=  response.data.paymentOptionJSON.paymentOptions[i]
                       }else if(jList[i].code=='dc') {
                           self.DebitCardOption = response.data.paymentOptionJSON.paymentOptions[i]
                       }else if(jList[i].code=='nb') {
                           self.netBankingData = response.data.paymentOptionJSON.paymentOptions[i]
                       }else if(jList[i].code=='mw') {
                            self.walletData =  response.data.paymentOptionJSON.paymentOptions[i]
                       }
                }
                self.eCashJSON = dummyData || '';
            }

            if(Object.keys(this.eCashJSON).length > 0){
                var storeRedemAmnt =  calculateRedemmedAmount(self.getCabFareDetails.fare_details.price.advance_charge.value,this.eCashJSON)
                self.eCashObjectLength = Object.keys(self.eCashJSON).length;
                self.availCash  = Math.ceil(storeRedemAmnt)
                this.storeAvailcash = Math.ceil(storeRedemAmnt)
                if(this.eCashJSON.ECashList.length == 1)
                    {
                        self.totalEcashAvailable = parseInt(this.eCashJSON.ECashList[0].redeemableECashInPaisa)/100;
                        if(this.eCashJSON.ECashList[0].eCashType=='EXPIRABLE'){
                           this.maxRedemeed = Math.ceil(this.eCashJSON.ECashList[0].redeemableECashInPaisa*.05*.01)
                           }
                        else{
                           this.maxRedemeed = Math.ceil(this.eCashJSON.ECashList[0].redeemableECashInPaisa*.01)
                        }
                    }else{
                        for(let k=0;k<this.eCashJSON.ECashList.length;k++) {
                            self.totalEcashAvailable = Math.ceil(self.totalEcashAvailable + parseInt(this.eCashJSON.ECashList[k].redeemableECashInPaisa)/100);
                    }

                        var expirableNodeIndex =  this.eCashJSON.ECashList.findIndex(x => x.eCashType === "EXPIRABLE")
                        var non_expirableNodeIndex =  this.eCashJSON.ECashList.findIndex(x => x.eCashType === "NON_EXPIRABLE")
                            if(this.eCashJSON.ECashList[non_expirableNodeIndex].redeemableECashInPaisa*.01>1){
                               this.maxRedemeed = Math.ceil((parseInt(this.eCashJSON.ECashList[expirableNodeIndex].redeemableECashInPaisa)*.05*.01) + parseInt(this.eCashJSON.ECashList[non_expirableNodeIndex].redeemableECashInPaisa)*.01)
                           }else{
                            this.maxRedemeed = Math.ceil((parseInt(this.eCashJSON.ECashList[expirableNodeIndex].redeemableECashInPaisa)*.05*.01))
                        }
                    }
                }
            }).catch(function (e) {
                console.log('some error occured : ' +e.message)
            });
        },
        navigateToReview(){
           this.$router.push({name:'ReviewTravellersView'})
        },
        openfareInfoDialog () {
          this.fareInfoDialog = true
        },
        updateRedeemValue (val) {
             this.availCash = val;
        },
        dateConversion(date,time){
             date = date.replace(/-/g,'/')
             let convertedTime = moment(time , ["h:mm A"]).format("HH:mm")
             let dateTime = new Date(date+' '+convertedTime);
             return Date.parse(dateTime)
        },
        submitPay(){
            let self = this
            this.ajaxLoading = true
            var payDetails={
                'patternMatch': new RegExp('^[1-9][0-9]?$'),
                'paymentModeType':'FULL',
                'paymentModeType':'ew',
                'paymentAmount': this.totalPrice,
                'tdate': this.tdateFill(this.tDate),
                'productCode': 'yatrapwamonuments'
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
				'YT-CHANNEL' : 'PWA',
				'YT-TENANT-CODE' : 'yatrapwamonuments',
			}}).then(function (response) {
				makePaymentCall(response.data)
				self.ajaxLoading = false
			})
          }
    },
    mounted () {
      this.getPaymentJSON(localStorage.getItem('superPnr'))
      this.tDate = localStorage.getItem('availableDate')
      this.totalPrice = localStorage.getItem('setMonumentPrice')
  }
}
</script>
<style>
    .tab-bank>label{
      color: rgb(0,0,0)!important;
      font-size: 16px;
      text-transform: capitalize;
    }
    .payment-option{
        padding-top: 15px;
        font-weight: normal;
    }
    .payment-option>.tabs>i{
        color: rgb(224, 224, 224)!important;
    }
    .txt-total_price{
        font-size: 16px;
    }
    .payment_view{
        background-color:white;
    }
	.payment-price .row {
		margin-bottom: 20px;
	}
    .payment_back{
        font-size:24px;
    }
    .cl_white_back{
        margin-left: 5px!important;
        font-size:25px;
        color:#616161!important;
    }
    .cd_header_white{
        font-weight: 500;
        font-size: 20px;
        color: #212121!important;
        margin-left: 0px;
    }
    .header_white{
        font-size: 18px;
        color: rgba(0, 0, 0, 0.87) !important;
     }
    .footerfixed {
        position: fixed;
        bottom: 0;
        left: 12px;
    }
    .footer-img {
        width: calc(100vw - 30px);
        height: auto;
    }
    .tabs{
        border-bottom: 1px solid #ccc;
        padding: 12px 20px;
        text-transform: capitalize;
        font-weight: 500;
    }
     .paycard .flex-3 {
        float: left;
        width: 33.3%;
        text-align:center
    }
    .paycard input {
      border: 1px solid #e0e0e0;
      width: 100%;
      margin-bottom: 10px;
      padding: 10px;
      outline: none;
      border-radius: 4px;
    }
    #expirationYear{
       border-bottom-left-radius: 0px;
       border-top-left-radius: 0px;
    }
    #expirationMonth{
       border-bottom-right-radius: 0px;
       border-top-right-radius: 0px;
    }
    .p20 {
        padding: 20px;
    }
    .slash {
        border-top: 1px solid #e0e0e0;
        padding: 10px;
        border-bottom: 1px solid #e0e0e0;
    }
    .paycard .br-0 {
        border-right: none;
    }
    .paycard .bl-0 {
        border-left: none;
    }
    .tabs:last-child {
        border-bottom: 1px solid #ccc;
    }
    .tab-bank div:last-child {
        height: 0;
        min-height: 0;
    }
    .tprice {
        padding:10px 16px;
    }
   .sltpay {
        background: white;
        padding: 12px 20px 8px 20px;
        margin-top: 10px;
        font-size: 13px;
        color: rgb(158, 158, 158);
    }
    .hv_info_icon{
        margin-left:2px;
        color: rgb(30, 136, 229)!important;
        font-size:20px;
        margin-top: -4px;
    }
    .input-ecash{
        padding: 5px 0 0;
    }
    .input-ecash input{
        border: 1px solid #ccc; border-radius: 4px; width: 98%;
        height: 38px; padding: 10px;
    }
    .lght-sm{
        color: rgb(158,158,158);
        font-size: 11px;
    }
    .hover:hover{
        cursor: pointer;
    }
    .footer-btn{
        text-align: center;
        padding: 10px 0 ;
    }
    .ecash-section{
        padding: 0 15px 0px;
        background: #fff;
    }
    .ecash-section > .input-group__details{
        display: none;
    }
    .input-group.input-group--selection-controls{
        padding: 0px 0 0;
    }
    .application .theme--light.input-group--selection-controls{
        color:rgb(30,136,299);
        padding: 0 !important;
    }
    .img_ecash{
        width:40px; height: 12px;
    }
    .pt10{
        padding: 10px 0 0;
    }
    .fs-md{
        font-size: 16px;
    }
    .pt20{
        padding: 25px 15px 10px !important;
    }
    .nvDetails{
        margin-left:0px;width:15px;
        margin-right:15px;
    }
    .pricefixed{
        z-index: 99;
        position: static;
    }
	.monument-header .row {
		margin-left: 0 !important;
	}
	.txt-r {
		text-align: right;
	}
</style>

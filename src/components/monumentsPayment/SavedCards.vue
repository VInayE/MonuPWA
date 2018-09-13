<template>
    <v-dialog v-model="savedDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">

        <v-toolbar dark class="white cd_fixed_header">
            <v-btn icon @click.native="closeSavedDialog" dark style="margin-left:0px;">
                    <v-icon class="cl_white_back payment_back">arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title class="cd_header_white header_white">Saved Cards</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark flat @click.native="closeSavedDialog"></v-btn>
            </v-toolbar-items>
       </v-toolbar>

       <v-container class="p20 paycard bg-white" id="savedcard" v-if="savedVisible">
           <div class="main-section">
                <div  class="cart-section" 
                    v-for="(item,index) in savedCardsOption"
                    v-bind:class="{active : (cardIndex == index)}" @click="cardSelected(item,index)" v-if="savedCardsOption.length > 0" :key="index">
                    <div class="img mb10"><img src="visa.png"></div>
                    <div class="content-section">
                        <p> CARD {{index + 1}} </p>
                        <p class="mb10"> {{item.cardNumber}} </p>
                        <p> {{item.cardNumber}} </p>
                        <p> {{item.cardHolderFirstName}} </p>
                    </div>
                </div>
           </div>
           <div class="selectedCard">
               <div class="img mb10"><img src="visa.png"></div>
               <div class="content-section">
                    <p class="mb10"> {{savedCardsOption[this.cardIndex].cardNumber}} </p>
                    <p> {{savedCardsOption[this.cardIndex].cardNumber}} </p>
                    <p> {{savedCardsOption[this.cardIndex].cardHolderFirstName}} </p>
                    <v-flex xs4 offset-xs1 prel>
                        <input id="cvv_qb" autofocus
                            type="password"
                            v-model="cvv"
                            name="cvv-number"
                            @blur="checkCardDetails"
                            ref="cvv"
                            placeholder="CVV"
                            autocomplete="off"
                            v-on:keypress="onlyNumeric"
                            :maxlength="cardMaxLength"/>
                        <img :src="createImageURL('cvc_hint')" alt="cvc_hint" class="pabs cvv">
                    </v-flex>
                    <v-flex xs4 offset-xs8 errorMsg v-if="cardCVVErrorMsg">{{cardCVVErrorMsg}}</v-flex>
               </div>
           </div>
       </v-container>
       <loader-view v-if="ajaxLoadingDialog"></loader-view>
       <div class="pricefixed">
           <button class="btn red" @click.stop="submitPay">PROCEED TO PAY ₹{{totalPrice-redeemedamount}}</button>
       </div>
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
    props:['openSavedDialog','savedCardsOption','redeemedamount','superPNR'],  
    components: {
        LoaderView
    },
    data(){
          return {
              savedDialog: false,
              closedSavedDialog: true,
              savedVisible: true,
              cardIndex: 0,
              totalPrice: '',
              cvv: null,
              ajaxLoadingDialog:false,
              cardMaxLength:'3',
              paymentOpt:{},
              cardCVVErrorMsg:undefined
          }
    },
    watch:{
        openSavedDialog(){
            this.savedDialog = this.openSavedDialog;
        }  
    },
    mounted () {
        this.totalPrice = localStorage.getItem('setMonumentPrice')
        this.paymentOpt = {
            SavedCardsDetails:{
                  number: this.savedCardsOption[this.cardIndex].cardNumber,
                  name: this.savedCardsOption[this.cardIndex].cardName,       
                  mm: this.savedCardsOption[this.cardIndex].cardNumber.expiryMonth,
                  yy: this.savedCardsOption[this.cardIndex].cardNumber.expiryYear,
                  cvv: '',
                  payop: this.savedCardsOption[this.cardIndex].cardNumber.cardType
            }
        }
    },
    methods : {
        closeSavedDialog () {
            this.$emit('closeSavedDialog', false) 
        },
        cardSelected (item,index) {
            this.cardIndex = index            
            if(this.openSavedDialog){
                this.createOrderResponse = this.superPNR
                this.cardImg = ''
                this.paymentOpt = {
                  SavedCardsDetails:{
                    number: this.savedCardsOption[index].cardNumber,
                    name: this.savedCardsOption[index].cardName,
                    mm: this.savedCardsOption[index].expiryMonth,
                    yy: this.savedCardsOption[index].expiryYear,
                    cvv: '',
                    payop: this.savedCardsOption[index].cardType.indexOf('DebitCard') ? 'dc' : 'cc',
                    cardType: this.savedCardsOption[index].cardType
                  }
                }
            } 
            this.setFocus()
        },
        createImageURL(url){
			 return require('../../assets/images/icons/'+ url + ".png")
        },
        setFocus: function() {
            this.$refs.cvv.focus();
        },
        submitPay() {
            this.cardNumberErrorMsg = undefined
            if(this.validateCVV()){
                this.paySwiftCall();
            } else{
                return false
            }
        },
        validateCVV () {
            if(this.savedCardsOption[this.cardIndex].cvv && this.savedCardsOption[this.cardIndex].cvv == "optional") return true
            this.cardCVVErrorMsg = this.paymentOpt.SavedCardsDetails.cvv == '' ? 'Enter CVV number' : parseInt(this.paymentOpt.SavedCardsDetails.cvv) >= 0 && this.paymentOpt.SavedCardsDetails.cvv.length === parseInt(this.savedCardsOption[this.cardIndex].cvvLength) ? undefined : 'Enter Correct CVV no'
            if(this.cardCVVErrorMsg == undefined) {
               return true
            } else {
                let self = this
                setTimeout(function(){
                      self.cardCVVErrorMsg = undefined
                }, 2000);
                return false 
            }
        },
        onlyNumeric(evt,option) {
            var regex = new RegExp("^[0-9]+$");
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        },
        validateCardRegex(cardDetails){
               let pattern = new RegExp(cardDetails.cardValidations.regex)
               return pattern.test(this.paymentOpt.CreditCardDetails.number.replace(/\s/g, ''))
        },
        checkCardDetails (){
            this.paymentOpt.SavedCardsDetails.cvv = this.cvv || ''
            // this.paymentOpt = {
            //       SavedCardsDetails:{
            //           cvv: this.savedCardsOption[this.cardIndex].cardNumber.cvv
            //       }
            // }
            // let adFilterCndt =this.savedCardsOption.cardTypes.findIndex(this.validateCardRegex)
            // if(adFilterCndt>=0){
            //    this.selectedCard = this.savedCardsOption.cardTypes[adFilterCndt].cardValidations
            //    this.cardMaxLength = this.selectedCard.cvvLength
            //    this.cardImg = this.savedCardsOption.cardTypes[adFilterCndt].logoURL    
            // } else {
            //    this.cardMaxLength = '3'
            //    this.cardImg = ''    
            // }

        },
        tdateFill (date) {
            return dateFormat(date)
        },
        paySwiftCall(){
            let self = this
            this.ajaxLoadingDialog = true
            //var t = this.savedCardsOption.cardTypes.findIndex(this.validateCardRegex);
            var payDetails={
                'patternMatch': new RegExp('^[1-9][0-9]?$'),
                'paymentModeType':'FULL',
                'paymentAmount':localStorage.getItem('setMonumentPrice'),
                'tdate': this.tdateFill(this.tDate),
                'cno':this.paymentOpt.SavedCardsDetails.number.replace(/\s/g, ''),
                'cardType':this.paymentOpt.SavedCardsDetails.cardType,
                'cardHolderName':this.paymentOpt.SavedCardsDetails.name,
                'cardHolderNumber':this.paymentOpt.SavedCardsDetails.number,
                'cardMM':this.paymentOpt.SavedCardsDetails.mm,
                'cardYY':this.paymentOpt.SavedCardsDetails.yy,
                'cardCvv':this.paymentOpt.SavedCardsDetails.cvv,
                'payOptionType':this.paymentOpt.SavedCardsDetails.payop,
                'productCode': 'yatrapwamonuments'
            }
			
            let payswiftCardParams ={
                amountDisplayed : payDetails.paymentAmount,
                eCashRedemed:0,
                appVersion:'1.0',
                client:'APP',
                discount:0,
                discountingStatus:false,
                email:localStorage.getItem("setUserInfoDataEmail"),
                merchant:'yatra',
                mob:localStorage.getItem("setUserInfoDataMob"),
                otherDiscountingStatus:false,
                paymentMode:payDetails.paymentModeType,
                paymentOptionParameters:'tdate='+payDetails.tdate+'|merchant=yatra|product='+
                payDetails.productCode+'|payop='+payDetails.payOptionType+'|previousPayOp='
                +payDetails.payOptionType+'|cno='+payDetails.cno+'|ctype='+payDetails.cardType
                +'|isCardInternational=false|address_check_rdo=Domestic|cardholder_name='+payDetails.cardHolderName
                +'|cexpy=20'+payDetails.cardYY+'|cexpm='+payDetails.cardMM+'|ccsc='+payDetails.cardCvv+
                '|client=APP|uuid='+Date.parse(new Date()),
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
<style>
    *{
        margin: 0;
        padding: 0;
        font-family: 'Rubik', sans-serif;
        line-height: 22px;
    }
    .mb10{
        margin-bottom: 10px;
    }
    .main-section {
        white-space: nowrap;
        overflow-x: scroll;
	}
	.cart-section {
		width: 280px;
		margin-right: 10px;
		color: #fff;
		display: inline-block;
		text-transform: uppercase;
		background: #4C5A68;
	    padding: 8px;
	    border-radius: 3px;
	    position: relative;
	    margin-top: 12px;
	    overflow: hidden;
	    height: 157px;
	}
    .cart-section.active {
        border: 1px solid red
    }
	.cart-section:before {
	    position: absolute;
	    width: 100%;
	    height: 100%;
	    border-radius: 10px;
	    content: '';
	    background: #4F5D6A;
	    right: -65%;
	    top: 12px;
	    -ms-transform: rotate(20deg);
	    -webkit-transform: rotate(20deg);
	    transform: rotate(45deg);
	}
</style>
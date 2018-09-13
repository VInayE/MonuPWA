<template>
   <v-dialog v-model="debitDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-toolbar dark class="white cd_fixed_header">
            <v-btn icon @click.native="closeDebitDialog" dark style="margin-left:0px;">
                    <v-icon class="cl_white_back payment_back">arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title class="cd_header_white header_white">Debit Card</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark flat @click.native="closeCreditDialog"></v-btn>
            </v-toolbar-items>
        </v-toolbar>
       <v-container class="p20 paycard bg-white" id="debitcard" v-if="DebitVisible">
            <v-layout row wrap>
                <v-flex xs12 prel>
                  <input id="input1_dc"
                         v-model="paymentOpt.DebitCardDetails.number"
                         type="text"
                         maxlength="30"
                         autocomplete="off"
                         name="cc-number"
                         placeholder="Card Number"
                         v-on:keypress = "cardSpace($event)"
                         @paste = "checkCardPaste"
                         @blur="checkCardDetails"/>
                         <img v-if="cardImg !=''" :src="createImageURL(cardImg)" v-bind:alt="cardImg" class="pabs img-res">
                </v-flex>
                <v-flex xs12 errorMsg v-if="cardNumberErrorMsg">{{cardNumberErrorMsg}}</v-flex>
           </v-layout>
               <v-layout row wrap>
                <v-flex xs12>
                    <input id="input2_dc"
                           autocomplete="off"
                           v-model="paymentOpt.DebitCardDetails.name"
                           autocapitalize="none"
                           autocorrect="off"
                           name="name"
                           tabindex="0"
                           placeholder="Name On Card" />
                </v-flex>
                <v-flex xs12 errorMsg v-if="cardHolderErrorMsg">{{cardHolderErrorMsg}}</v-flex>
           </v-layout>
                <v-layout row wrap>
                   <v-flex xs7>
                    <input id="expirationMonth_dc"
                           class="flex-3 br-0"
                           v-model="paymentOpt.DebitCardDetails.mm"
                           maxlength="2" placeholder="MM"
                           autocomplete="cc-exp-month"
                           v-on:keyup="checkMonthLength"
                           v-on:keypress="onlyNumeric" />
                    <span class="flex-3 slash">/</span>
                    <input id="expirationYear_dc"
                           class="flex-3 bl-0"
                           ref="expiryYrs"
                           v-model="paymentOpt.DebitCardDetails.yy"
                           maxlength="2"
                           placeholder="YY"
                           autocomplete="cc-exp-year"
                           v-on:keypress="onlyNumeric" />
                    </v-flex>
                    
                <v-flex xs4 offset-xs1 prel>
                    <input id="cvv_dc"
                           type="password"
                           v-model="paymentOpt.DebitCardDetails.cvv"
                           placeholder="CVV"
                           autocomplete="cc-exp-year"
                           v-on:keypress="onlyNumeric"
                           :maxlength="cardMaxLength"/>
                            <img :src="createImageURL('cvc_hint')" alt="cvc_hint" class="pabs cvv">
                </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs8 errorMsg v-if="cardExpiryDateErrorMsg">{{cardExpiryDateErrorMsg}}</v-flex>
                  <v-flex xs4 offset-xs8 errorMsg v-if="cardCVVErrorMsg">{{cardCVVErrorMsg}}</v-flex>
                </v-layout>
         </v-container>
         <loader-view v-if="ajaxLoadingDialog"></loader-view>
         <div class="pricefixed"><button class="btn"  @click.stop="submitPay">PROCEED TO PAY ₹{{totalPrice}}</button></div>
    </v-dialog>
</template>
<script>
  import { mapGetters,mapMutations } from 'vuex'
  import * as types from '../../store/types'
  import {makePaymentCall} from '../../helper/payment'
  import {dateFormat} from '../../helper/pwaMonumentsHelper'
  import LoaderView from '../common/loader'
  import axios from 'axios'
  import qs from 'qs'
  export default {
      props:['openDebitDialog','debitCardOption','redeemedamount','superPNR'],
      components:{
         LoaderView  
      },
      data () {
          return {
              debitDialog: false,
              DebitVisible: true,
              cardMaxLength: '3',
              selectedCardForValidation: false,
              cardCVVErrorMsg:undefined,
              selectedCard: {},
              tDate: '',
              cardExpiryDateErrorMsg: undefined,
              cardNumberErrorMsg: undefined,
              cardHolderErrorMsg: undefined,
              ajaxLoadingDialog:false,
              cardImg: '',
              totalPrice: '',
              createOrderResponse:{},
              paymentOpt:{
                DebitCardDetails:{
                  number:'',
                  name:'',       
                  mm:'',
                  yy:'',
                  cvv:'',
                  payop: 'dc'
                }
              }
          }
      },
      mounted () {
          this.createOrderResponse = this.superPNR
          this.tDate = localStorage.getItem('availableDate')
          this.totalPrice = localStorage.getItem('setMonumentPrice')
      },      
       watch:{
       openDebitDialog(){
           this.debitDialog = this.openDebitDialog;
           if(this.openDebitDialog){
               this.createOrderResponse = this.superPNR
               this.selectedCardForValidation = false
               this.cardImg = ''
               this.paymentOpt = {
                 DebitCardDetails:{
                  number:'',
                  name:'',       
                  mm:'',
                  yy:'',
                  cvv:'',
                  payop: 'dc'
                }  
               }
           }
       }
     },
      methods: {
		  createImageURL(url){
			 return require('../../assets/images/icons/'+ url + ".png")
          },
          checkMonthLength(){
            if(this.paymentOpt.DebitCardDetails.mm.length == 2){
             this.$refs.expiryYrs.focus()
            }
          },
          tdateFill (date) {
               return dateFormat(date)
           },
           closeDebitDialog () {
             this.$emit('closeDebitDialog', false) 
           },
           validateCardRegex(cardDetails){
               let pattern = new RegExp(cardDetails.cardValidations.regex)
               return pattern.test(this.paymentOpt.DebitCardDetails.number.replace(/\s/g, ''))
           },
           checkCardDetails () {
              let adFilterCndt =this.debitCardOption.cardTypes.findIndex(this.validateCardRegex)
              if(adFilterCndt>=0){
               this.selectedCard = this.debitCardOption.cardTypes[adFilterCndt].cardValidations
               this.cardMaxLength = this.selectedCard.cvvLength
               this.selectedCardForValidation = true
                  this.cardImg = this.debitCardOption.cardTypes[adFilterCndt].logoURL
             } else {
               this.selectedCardForValidation = false 
               this.cardImg = ''
               this.cardMaxLength = '3'
             }
           },
            validateName () {
              if(this.paymentOpt.DebitCardDetails.name ==''){
                  this.cardHolderErrorMsg = 'Enter Card Holder Name'
                  let self = this
                  setTimeout(function(){
                      self.cardHolderErrorMsg = undefined
                  }, 3000);
                  return false
              }else{
                  this.cardHolderErrorMsg = undefined
                  return true
              }
          },
          validateExpiryDate () {
            this.cardExpiryDateErrorMsg = this.paymentOpt.DebitCardDetails.mm == '' || parseInt(this.paymentOpt.DebitCardDetails.mm) > 12 || this.paymentOpt.DebitCardDetails.yy == ''? 'Invalid Expiry Date' : parseInt(this.paymentOpt.DebitCardDetails.yy) > parseInt(new Date().getFullYear().toString().substr(-2)) ? undefined : parseInt(this.paymentOpt.DebitCardDetails.yy) == parseInt(new Date().getFullYear().toString().substr(-2)) && parseInt(this.paymentOpt.DebitCardDetails.mm) > parseInt(("0" + (new Date().getMonth() + 1)).slice(-2))  ? undefined: 'Invalid Expiry Date'
           if(this.cardExpiryDateErrorMsg == undefined) {
                return true
            }else {
              let self = this
              setTimeout(function(){
                      self.cardExpiryDateErrorMsg = undefined
              }, 3000);
              return false
            }                             
          },
          validateCVV () {
            if(this.selectedCard.cvv && this.selectedCard.cvv == "optional") return true
            this.cardCVVErrorMsg = this.paymentOpt.DebitCardDetails.cvv == '' ? 'Enter CVV number' : parseInt(this.paymentOpt.DebitCardDetails.cvv)>=0 && this.paymentOpt.DebitCardDetails.cvv.length === parseInt(this.selectedCard.cvvLength)?undefined : 'Enter Correct CVV no'
           if(this.cardCVVErrorMsg == undefined) {
               return true
            } else {
                let self = this
                setTimeout(function(){
                      self.cardCVVErrorMsg = undefined
                }, 3000);
                return false 
            }
          },
           submitPay() {
              if(!this.selectedCardForValidation){
                  this.cardNumberErrorMsg = 'Enter correct card details'
                  let self = this
                  setTimeout(function(){
                      self.cardNumberErrorMsg = undefined
                  }, 3000);
                  return false
              }else{
                  this.cardNumberErrorMsg = undefined
                  if(this.validateName() && this.validateExpiryDate() && this.validateCVV()){
                       this.paySwiftCall();
                  } else{
                      return false
                  }
              }
          },
          paySwiftCall(){
			let self = this
			this.ajaxLoadingDialog = true
			var t = this.debitCardOption.cardTypes.findIndex(this.validateCardRegex);
			var payDetails={
				'patternMatch': new RegExp('^[1-9][0-9]?$'),
				'paymentModeType':'FULL',
				'paymentAmount':localStorage.getItem('setMonumentPrice'),
				'tdate': this.tdateFill(this.tDate),
				'cno':this.paymentOpt.DebitCardDetails.number.replace(/\s/g, ''),
				'cardType':this.debitCardOption.cardTypes[t].code,
				'cardHolderName':this.paymentOpt.DebitCardDetails.name,
				'cardHolderNumber':this.paymentOpt.DebitCardDetails.number,
				'cardMM':this.paymentOpt.DebitCardDetails.mm,
				'cardYY':this.paymentOpt.DebitCardDetails.yy,
				'cardCvv':this.paymentOpt.DebitCardDetails.cvv,
				'payOptionType':this.paymentOpt.DebitCardDetails.payop,
				'productCode': 'yatrapwamonuments',
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
					paymentOptionParameters:'tdate='+payDetails.tdate+'|merchant=yatra|product='+
					payDetails.productCode+'|payop='+payDetails.payOptionType+'|previousPayOp='+
					payDetails.payOptionType+'|cno='+
					payDetails.cno+'|ctype='+payDetails.cardType
					+'|isCardInternational=false|address_check_rdo=Domestic|cardholder_name='+payDetails.cardHolderName
					+'|cexpy=20'+payDetails.cardYY+'|cexpm='+payDetails.cardMM+'|ccsc='+payDetails.cardCvv+
					'|client=APP|uuid='+Date.parse(new Date),
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
          },
          cardSpace(evt) {
              evt = (evt) ? evt : window.event;
              var charCode = (evt.which) ? evt.which : evt.keyCode;
              if ((charCode > 31 && (charCode < 48 || charCode > 57)) || this.paymentOpt.DebitCardDetails.number.replace(/\s/g, '').length >=19) {
                evt.preventDefault();
              } else {
                let cardNumber = this.paymentOpt.DebitCardDetails.number.replace(/\s/g, '')
                if(cardNumber.length !=0 && cardNumber.length % 4 == 0) {
                   this.paymentOpt.DebitCardDetails.number +=" "
                }
               return true;
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
          checkCardPaste(e){
            let self = this
                setTimeout(function(){
                let data = e.target.value.replace(/[^0-9\.]+/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim()
                self.paymentOpt.DebitCardDetails.number = data
                e.preventDefault()
                e.stopPropagation()
                }, 10);
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
    .errorMsg{
      margin-top:-2px;
      margin-bottom:5px;
      color: #f44336;
    }
    .img-res {
        right: 20px;
        top: 10px;
        width: 14%;
        height: auto;
        }
    .cvv {
        width: 25%;
        top: 11px;
        right: 10px;
    }
</style>

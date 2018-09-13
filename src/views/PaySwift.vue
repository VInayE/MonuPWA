<template>
  <v-app name="payswift">
    <v-toolbar class="monument-header">
        <v-layout row wrap class="m0">
            <v-flex xs1 class="header_arrow_back">
          <v-icon @click="navigateToReview()">arrow_back</v-icon>
        </v-flex>
          <v-flex xs9 class=""><div class="lh29 fs20">Make Payment</div></v-flex>
        </v-layout>
    </v-toolbar>
      <v-card color="" flat class="mt10">
        <v-card-text>
            <v-flex xs12 class="txt-total_price">
              <v-flex xs6 left class="fs-md">Total Price</v-flex>
              <v-flex xs6 right class="fs-md">₹ {{totalPrice}}
             <v-icon class="hv_info_icon" slot="activator" @click.stop="openfareInfoDialog">info_outline</v-icon>
              </v-flex>
          </v-flex>
        </v-card-text>
    </v-card>
  </v-app>
</template>
<script>
import {EventBus} from '../events-bus/index.js'
export default {
  data () {
   return {
       totalPrice:''
   }
  },
  watch:{
  },
  mounted() {
      var self = this
  },
  methods : {
         navigateToReview(){
             
         }   
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
    padding: 11.3px;
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
</style>

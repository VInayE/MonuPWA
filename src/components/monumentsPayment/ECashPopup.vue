
<template>
   <transition name="modal" v-if="eCashDialog">
    <div class="modal-mask dfb_div_layout">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header font-weight">
               Redeem eCash
            </slot>
          </div>
          <div class="modal-body"> <div class="ecash-popup">
            
                <v-layout row wrap class="mt16">
                  <v-flex xs7 class="">Total eCash Available</v-flex>
                  <v-flex xs5 class="text-right">₹ {{totalecashavailable}}</v-flex>
                </v-layout>

                <v-layout row wrap class="mt16">
                  <v-flex xs7 class="">Maximum Redeemable</v-flex>
                  <v-flex xs5 class="text-right">₹ {{storeAvailcash}}</v-flex>
                  <v-flex xs12 class="txt-lght">(as per t&amp;c's)</v-flex>
                </v-layout>

                <v-layout row wrap class="mt16">
                  <v-flex xs12 class="">Reduce Amount to be redeemed:</v-flex>
                </v-layout>
                <v-layout row warp>
                  <v-flex xs8>
                        <div class="input-group__input input-ecash">
                          <input  type="number" max="250" maxlength="3" v-model="redeemedValue" v-on:keypress="onlyNumeric" autofocus>
                        </div>
                  </v-flex>
                  <v-flex xs4>
                      <div class="btn-proceed btn-style">
                        <v-btn type="button" class="bg-red btn btn--block btn--raised secondary" :disabled="disableBtn">
                          <div class="btn__content" @click="updateRedeemedValue">
                             Update
                          </div>
                        </v-btn>
                      </div>
                  </v-flex>
                </v-layout>
            </div>
          </div>
          
          <div class="modal-footer">
            <slot name="footer">
                <a class="txt_blue font-bold darken-2 pb15" flat="flat"  @click="closeDialog">CLOSE</a>
            </slot>
          </div>
        </div>
      </div>
    </div>
   </transition>
</template>
<script>
    export default {
props: ['openEcashDialog','totalecashavailable','maxRedemeed','totalAmnt','storeAvailcash'],
data () {
       return {
         eCashDialog: false,
         redeemedValue:'',
         disableBtn:true  
       }
     },
watch: {
       openEcashDialog: function () {
         this.eCashDialog = this.openEcashDialog
         if(this.dialog){
           setBodyProperty()
         }
         this.redeemedValue = ''
       },
       totalAmnt:function(){
           this.redeemedValue = ''
       },
      redeemedValue:function(){
          
          if(this.redeemedValue == "")
              {
                 this.disableBtn=true 
              }
          else {
              this.disableBtn=false
              if(parseInt(this.redeemedValue)>parseInt(this.storeAvailcash) || parseInt(this.redeemedValue)==0) {
                  this.redeemedValue = this.redeemedValue.substr(0,this.redeemedValue.length-1)
              }
            }
        }
     },
    methods:{
            closeDialog(){
                this.$emit('closeEcashDialog', false) 
            },
            updateRedeemedValue(event){
                this.$emit('updateRedeemedValue', this.redeemedValue)
                
                this.$emit('closeEcashDialog', false) 
            },
            onlyNumeric(evt, option) {
                var regex = new RegExp("^[0-9]+$");
                var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                if (!regex.test(key)) {
                    event.preventDefault();
                    return false;
                }
            }
        }   
    }
</script>


<style scoped>
    .ecash-popup{
      background: #fff;
    }
    .ecash-popup .head{
        font-size: 20px !important;
        font-weight: normal;
    }
    .ecash-popup .mt16{
      margin: 16px 0 0;
    }
    .ecash-popup .txt-lght{
      color: rgb(158,158,158);
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
    
    
    .line_height_30{
    line-height: 30px;
    color: #333;
  }
  .txt_right{
    text-align:right!important;
  }
  .font_13{
    font-size:13px;
  }
  .img_ecash{
     width: 50px;
    margin-left: 5px;
    margin-top: 5px;
    position: relative;
    top: 1px;

  }
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 20px 5px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header {
    font-size: 20px;
    font-weight: 500;
    color: black;
/*    border-bottom: 1px solid #ccc;*/
    padding: 6px 0px 1px;
}

.modal-body {
  margin:  0;
      height: inherit;
  overflow-y:auto;
  overflow-x:hidden;

}
.modal-footer{
    width: 275px;
    margin: 0 auto;
    background: #fff;
    text-align: center;
    padding: 0px 85px 15px 66px;
}
.modal-foote button .btn__content{
    font-weight: 600;
}
.modal-default-button {
  float: right;
}
.modal-enter {
  opacity: 0;
}
.btn-proceed .bg-red{
 box-shadow: none;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.text-large{
  font-size: 18px; padding : 5px 0; color: #000;
}
    .pb15{
        padding: 0 0 15px;
    }
    .txt_blue{
        color: rgb(30,136,229) !important;
        padding-bottom: 15px;
    }
</style>

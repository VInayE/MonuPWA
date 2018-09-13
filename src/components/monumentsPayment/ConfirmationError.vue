
<template>
   <transition name="modal" v-if="showConfirmationDialog">
    <div class="modal-mask dfb_div_layout">
      <div class="modal-wrapper">
          <div class="modal-container">
              <div class="modal-header">
                <slot name="header font-weight">
                   Payment Info
                </slot>
              </div>
              <div class="modal-body">
                  <div class="ecash-popup">{{errorMessage}}</div>
                  <div class="modal-footer">
                    <slot name="footer mt16">
                        <a class="txt_blue font-bold darken-2 pb15" flat="flat" @click="closeDialog">OK</a>
                    </slot>
                  </div>
              </div>
          </div>
       </div>
    </div>
   </transition>
</template>
<script>
  export default {
    props: ['errorMessage','showConfirmationDialog'],
    data () {
      return {
        showConfirmationDialog: true
      }
    },
    watch: {
      openConfirmationDialog: function () {
        this.showConfirmationDialog = this.showConfirmationDialog,
        this.errorMessage=this.errorMessage
      },
    },
    methods:{
      closeDialog(){
        this.$router.push({name:'MonumentSRPView'})
      }
    }
  }
</script>


<style scoped>

    .ecash-popup{
      background: #fff;
      margin-top:5px;
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
      /*border-bottom: 1px solid #ccc;*/
      padding: 6px 0px 1px;
    }
    .modal-body {
      margin:  0;
      height: inherit;
      overflow-y:auto;
      overflow-x:hidden;
    }
    .modal-footer{
      margin: 0 auto;
      background: #fff;
      text-align: right;
      padding: 10px 10px 15px 0;
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

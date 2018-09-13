<template>
   <transition name="modal" v-if="dialog">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body" v-if="errorMessage">
            {{errorMessage.message}}
          </div>
          <div class="modal-footer">
            <slot name="footer">
                <a class="txt_blue font-bold darken-2" flat="flat" @click="closeDialog">OK</a>
            </slot>
          </div>
        </div>
          
      </div>
    </div>
   </transition>
</template>
<script>
   export default {
     props: ['showPaymentDialog','paymentErrorMessage'],
     data: function () {
       return {
         errorMessage: {},
         dialog:false
       }
     },
     watch:{
       showPaymentDialog (){
           this.errorMessage = this.paymentErrorMessage
           this.dialog = this.showPaymentDialog
       }  
     },
     methods: {
       closeDialog () {
           router.push({name:'CabsHomeView',params:{option:'rental'}})
       }
     }
   }
</script>
<style scoped>
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
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
}

.modal-body {
  margin: 10px 0;
  height:auto;
  overflow-y:auto;
  overflow-x:hidden;

}
.modal-footer{
    width: 275px;
    margin: 0 auto;
    background: #fff;
    text-align: right;
    padding: 10px 20px 15px 0;
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

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.text-large{
  font-size: 18px; padding : 10px 0; color: #000;
}
</style>

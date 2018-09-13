<template>
   <transition name="modal" v-if="messageDialog">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
               Information
            </slot>
          </div>
          <div class="modal-body">
             Thank you, reset password sended to your EmialId.
          </div>
          <div class="modal-footer">
            <slot name="footer">
                  <a class="cF34747 darken-2 txt_blue font-bold" flat="flat" @click.prevent="closeDialog">OK</a>
            </slot>
          </div>
        </div>
      </div>
    </div>
   </transition>
</template>
<script>   
   export default {
     props: ['showForgotMessage'],
     data () {
       return {
         messageDialog: false
       }
     },
     watch: {
       showForgotMessage () {
         this.messageDialog = this.showForgotMessage
       }
     },
     methods: {
       closeDialog () {
           this.$router.push({name:'LoginView'})
       }
     }
   }
</script>
<style scoped>
  
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
}
.modal-header {
    font-size: 20px;
    font-weight: 500;
    color: black;
    height: 20px;
}

.modal-body {
  margin: 20px 0;
}
.modal-footer{
    width: 275px;
    margin: 0 auto;
    background: #fff;
    text-align: right;
    padding: 10px 20px 15px 0;
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

</style>
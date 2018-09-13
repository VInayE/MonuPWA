<template>
   <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body" style="height:60px;">
             <v-card-text class="center-align">
               <v-layout row wrap>
                  <v-flex xs12 class="center-align">
                    <v-progress-circular indeterminate class="red--text"></v-progress-circular>
                  </v-flex>


                  <v-flex xs12 class="txt_please_wait center-align">Please Wait...</v-flex>
              </v-layout>
            </v-card-text>
          </div>
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>
   </transition>
</template>
<script>
 
</script>
<style scoped>
  h3 {
    line-height: inherit
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
  width: 220px;
  height:120px;
  margin: 0px auto;
  padding: 10px;
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
.txt_please_wait{
  margin: 15px 0 0;
}

.center-align{
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
<template>
    <v-dialog v-model="QBCardDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
           <v-container class="p20 paycard bg-white">test</v-container>
    </v-dialog>
</template>
<script>
 export default{ 
    props:['openQBDialog'],
    data() {
        return{
           QBCardDialog:false
        }
    },
       watch:{
       openQBDialog(){
           this.QBCardDialog = this.openQBDialog;
       }
     },
    methods: {
     showEMIoption (index) {
      this.$emit('selectedEmiTenure',index)         
    },
     closeSelectBoxDialog () {
             this.$emit('closeSelectBoxDialog', false)  
     }
   }  
 } 
</script>
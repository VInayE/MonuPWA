<template>
    <v-dialog v-model="selectBankDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
           <v-toolbar dark class="red">
            <v-btn icon @click.stop="closeSelectBoxDialog" dark>
                    <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title>Bank Having EMI option</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark flat @click.native="closeCreditDialog"></v-btn>
            </v-toolbar-items>
        </v-toolbar>
           <v-layout class="">
            <v-flex xs12>
            <div class="tabs" v-for="(item,index) in emiOption.banks" :key="index">
               <div @click.stop="showEMIoption(index)">{{item.displayText}}</div>
            </div>
            </v-flex>
        </v-layout>
    </v-dialog>
</template>
<script>
 export default{ 
    props:['emiOption','openSelectBoxDialog'],
    data() {
        return{
            bankcode: '',
            selectBankDialog: false
        }
    },
       watch:{
       openSelectBoxDialog(){
           this.selectBankDialog = this.openSelectBoxDialog;
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
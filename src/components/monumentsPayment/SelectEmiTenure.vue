<template>
    <v-dialog v-model="selectEmiTenureDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
     <v-toolbar dark class="red">
            <v-btn icon @click.stop="closeSelectEmiTenureDialog" dark>
                    <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title>EMI Plans</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark flat @click.native="closeCreditDialog"></v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-layout class="">
           <v-flex xs12>
                <div class="tabs" v-for="(item,index) in selectedEmiTenure" :key="index" @click.stop="selectedEMIOption(item.interestRate,item.emiTenure)">
                 Rs {{calculateEMICost(item.interestRate,item.emiTenure)}} in {{item.emiTenure}} months 
                </div>
            </v-flex>
        </v-layout>
    </v-dialog>
</template>
<script>
 export default { 
    props:['selectedEmiTenure','openSelectEmiTenureDialog'],
    data() {
        return{
            bankcode: '',
            selectEmiTenureDialog: false
        }
    },
    watch:{
       openSelectEmiTenureDialog(){
           this.selectEmiTenureDialog = this.openSelectEmiTenureDialog;
       }
     },
    methods: {
     calculateEMICost (interestRate,emiTenure) {
         let monthlyInterestRatio = (interestRate/100)/12
	     let top = Math.pow((1+monthlyInterestRatio),emiTenure)
         let bottom = top -1
         let sp = top / bottom
         let emi = ((10000 * monthlyInterestRatio) * sp)
         return parseInt(emi)
     },  
     selectedEMIOption(interestRate,emiTenure) {
         let selectEMI = {
            'months':emiTenure
         } 
         selectEMI.cost = this.calculateEMICost(interestRate,emiTenure) 
         this.selectEmiTenureDialog = false 
         this.$emit('emiTenureSelected',selectEMI)
     }, 
     closeSelectEmiTenureDialog () {
         this.$emit('closeSelectEmiTenureDialog', false) 
     }
   }  
     
 } 
</script>
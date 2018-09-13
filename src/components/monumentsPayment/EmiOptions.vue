<template>
     <v-dialog v-model="emiDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-toolbar dark class="red">
            <v-btn icon @click.native="closeEmiDialog" dark>
                    <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title>EMI Options</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark flat @click.native="closeCreditDialog"></v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-snackbar :timeout="timeout" :bottom=" y === 'bottom'" :multi-line="true" v-model="snackbar">
           Please select bank
            <v-btn flat class="txt-ff" @click.native="snackbar === false">Close</v-btn>
        </v-snackbar>
         <div @click.stop="openSelectBoxDialog = true" class="tabs">{{selectedBankCondition ? bankSelected:'Select Your Bank'}} <v-icon class="right">keyboard_arrow_right</v-icon></div>
        <select-bank :openSelectBoxDialog="openSelectBoxDialog" 
                     @closeSelectBoxDialog="openSelectBoxDialog = false" 
                     :emiOption="emiOption" 
                     @selectedEmiTenure="selectedtBankOption($event)">
        </select-bank>
         <div @click.stop="selectedBankCondition?openSelectEmiTenureDialog = true:snackbar = true" class="tabs">
            {{emiTenureCondition? selectedEMIOption : 'Select EMI Options'}} <v-icon class="right">keyboard_arrow_right</v-icon></div>
        <select-emi-tenure :openSelectEmiTenureDialog="openSelectEmiTenureDialog"
                           @closeSelectEmiTenureDialog="openSelectEmiTenureDialog = false"                                                 
                           :selectedEmiTenure="selectedEmiTenure"
                           @emiTenureSelected="emiTenureSelecteds($event)"
        ></select-emi-tenure>
        <v-container class="p20 paycard" id="emi" v-if="EmiVisible">
            <v-layout row>
                <v-flex xs12>
                  <input id="input1" v-model="paymentOpt.EmiCardDetails.number" type="text" maxlength="30" autocomplete="off" name="cc-number" placeholder="Card Number" />
                </v-flex>
           </v-layout> 
               <v-layout row> 
                <v-flex xs12>
                    <input id="input2" autocomplete="off" v-model="paymentOpt.EmiCardDetails.name" autocapitalize="none" autocorrect="off" name="name" tabindex="0" placeholder="Name On Card" />
                </v-flex>
           </v-layout>
            <v-layout row>
                <v-flex xs8>
                    <input id="expirationMonth" class="flex-3 br-0" v-model="paymentOpt.EmiCardDetails.mm" maxlength="2" placeholder="MM" autocomplete="cc-exp-month" type="text"/>
                    <span class="flex-3 slash">/</span>
                    <input id="expirationYear" class="flex-3 bl-0" v-model="paymentOpt.EmiCardDetails.yy" maxlength="2" placeholder="YY" autocomplete="cc-exp-year" type="tel" />
                </v-flex>
                <v-flex xs4>
                    <input id="cvv" v-model="paymentOpt.EmiCardDetails.cvv" maxlength="2" placeholder="CVV" autocomplete="cc-exp-year" type="tel" />
                </v-flex>
           </v-layout>
         </v-container>
        
    </v-dialog>
</template>
<script>
    import SelectBank from './SelectBank'
    import SelectEmiTenure from './SelectEmiTenure'
    export default {
      props:['emiOption','openEmiDialog'],
      data () {
          return {
              timeout: 3000,
              y: 'bottom',
              snackbar: false,
              openSelectEmiTenureDialog: false,
              selectedBankCondition:false,
              emiTenureCondition: false,
              selectedEMIOption: '',
              bankSelected:'',
              openSelectBoxDialog: false,
              emiDialog: false,
              bankcode: '',
              EmiVisible: true,
              selectedEmiTenure:[],
              paymentOpt:{
                EmiCardDetails:{
                  number:'',
                  name:'',        
                  mm:'',
                  yy:'',
                  cvv:'',
                  payop: 'cc'
                }
              }
          }
      },
       watch:{
       openEmiDialog(){
           this.emiDialog = this.openEmiDialog;
           if(this.openEmiDialog){
             this.emiTenureCondition = false
          this.selectedBankCondition = false
          this.selectedEMIOption = ''
          this.bankSelected = ''
   
           }
       }
     },
      methods: {
           closeEmiDialog () {
             this.$emit('closeEmiDialog', false)  
           },
          emiTenureSelecteds(event){
              this.emiTenureCondition = true
              this.openSelectEmiTenureDialog = false
              this.selectedEMIOption = 'Rs ' +event.cost + ' ' + event.months+ 'months'
          },
          selectedtBankOption(index){
              this.emiTenureCondition = false
              this.selectedBankCondition = true
              this.bankSelected = this.emiOption.banks[index].displayText
              this.selectedEmiTenure = this.emiOption.banks[index].emiTypes
              this.openSelectBoxDialog = false
          }
          
      },
      components: {
          SelectBank,
          SelectEmiTenure
      }
     

  }
</script>
<template>
	<v-app class="register-block">
		<v-snackbar class="snacktxt" :timeout="timeout" :bottom="y === 'bottom'" v-model="snackbar">
            {{snackbarText}}
        	<v-btn flat class="txt-ff" @click.native="snackbar = false">Close</v-btn>
      	</v-snackbar>
		<v-toolbar class="monument-header">
		  <v-layout row wrap class="m0">
				<v-flex xs1 class="header_arrow_back">
			  <v-icon @click="navigateToLogin()">arrow_back</v-icon>
			</v-flex>
			  <v-flex xs9 class=""><div class="lh15 fs20">Register with Yatra</div></v-flex>
		  </v-layout>
		</v-toolbar>
		<v-form v-model="valid" ref="form">
			 <v-container>
				<v-layout row wrap>
						<v-flex xs6 class="">
						<v-text-field label="First Name" ref="input" required  v-model="firstName" class="pb0" :rules="submitted ? Firstnames_rule : []"></v-text-field>
						</v-flex>
						<v-flex xs5 offset-xs1 class="">
						<v-text-field label="Last Name" required  v-model="lastName" class="pb0" :rules="submitted ? Lastnames_rule: []"></v-text-field>
						</v-flex>
					<v-flex xs4 class="">
						<v-text-field label="ISD Code" v-model="selectedTelephoneCode" class="pb0" @click="telephoneDialog" v-on:keypress="telephoneDialog"></v-text-field>
					</v-flex>
					<v-flex xs7 offset-xs1 class="">
						<v-text-field label="Mobile Number"
									  required
									  v-model="phoneNumber"
									  maxlength="10"
									  class="pb0"
									  v-on:keypress="isNumber($event)"
									  :rules="submitted ? Phone_rules:[]"
									  ref= "registerPhone">
					   </v-text-field>
					</v-flex>
					  <v-flex xs12 class="">
						<v-text-field label="Email ID" ref= "registerEmail" v-model="emailId"  class="pb0" required :rules="submitted ? Email_rules:[]"></v-text-field>
					</v-flex>
					<v-flex xs12>
						<v-btn class="regbtn redBtn" @click.stop="register">Register</v-btn>
					</v-flex>
				</v-layout>
			</v-container>
    	</v-form>
    	<register-message :showRegisterMessage="showRegisterMessage"></register-message>
	</v-app>
</template>

<script>
import {checkRegister} from '../api/api'
export default {
	components:{
        RegisterMessage : () => import('../components/common/registerMessage.vue')
     },
	data(){
		return {
			   showRegisterMessage: false,
			   showTelephoneDialog: false,
               selectedTelephoneCode: '+91',
               snackbar: false,
               snackbarText:'',
               timeout: 3000,
               y: 'bottom',
               valid: false,
               showLoader: false,
               firstName: '',
               lastName: '',
               emailId: '',
               registerDialog: false,
               phoneNumber: '',
               password: '',
               isd: '',
               channel: 'b2c',
               productId: 'yatrapwamonuments',
               submitted: false,
               Firstnames_rule:[
                (v) => !!v || 'First Name is Required',
               ],
               Lastnames_rule:[
                (v) => !!v || 'Last Name is Required',
               ],
               Email_rules:[
                (v) => !!v || 'Email addresss is required',
                (v) => /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})+$/.test(v) || 'Enter correct Email Address'
              ],
               Phone_rules:[
                (v) => !!v || 'Phone Number is required',
                (v) => /^\d{10}$/.test(v) || 'Please enter valid phone no'
              ],
              Password_rules:[
                (v) => !!v || 'Password is required',
                (v) =>  /^(?=^.{8,}$)(?=.*[a-zA-Z])(?=.*[0-9]).+$/.test(v) || 'Please enter valid password'
              ]
		}
	},
		methods: {
           selectedTelephone (event) {
            this.selectedTelephoneCode = event && event != undefined && Object.keys(event).length >0 ? "+" + event.countryCode: '+91'
            this.showTelephoneDialog = false
            this.telephoneSelected = event
            },
           telephoneDialog () {
            this.showTelephoneDialog = true
           },
           isNumber (evt) {
             evt = (evt) ? evt : window.event;
             var charCode = (evt.which) ? evt.which : evt.keyCode;
             if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
                evt.preventDefault();;
             } else {
                return true;
             }
           },
           formIsValid () {
               var emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
               return this.firstName !== '' && this.lastName !== '' && this.emailId !== '' && this.phoneNumber !== '' && emailPattern.test(this.emailId)
           },
           register () {
             this.submitted = true
             if(this.$refs.form.validate()  && this.$refs.form.value && this.formIsValid() ) {
                let postData = {
                  email: this.emailId,
                  mobile: this.phoneNumber,
                  mobileISD: this.selectedTelephoneCode,
                  includeOptionalParams: true,
                  channel: this.channel,
                  productId: this.productId
                }
                this.showLoader = true
                let self = this
                checkRegister(postData).then(response => {
                  if (response.data.status == "SUCCESS") {
                     self.showRegisterMessage = true
                  } else {
                    self.snackbar = true
                    self.snackbarText = response.data.responseMessage
                    self.showLoader = false
                 }
                }, function (response) {
                 self.snackbar = true
                 self.snackbarText =response.data.responseMessage ?response.data.responseMessage :  'Some Error occured . Try after sometimes'
                 self.showLoader = false
               });
             }
           },
			navigateToLogin(){
				this.$router.push({name:'LoginView'})
			}
    }
	}
</script>

<style scoped="true">
.m0 {
    margin: 0 !important;
}
.container {
    padding: 20px;
}
	.primary--text{
		color: #333 !important;
	}
	.register-block {
		background: #fff;
	}
</style>

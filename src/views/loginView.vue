<template>
	<v-app class="login-view" v-model="loginDialog">
		<v-snackbar class="snacktxt" :timeout="timeout" :bottom="y === 'bottom'" v-model="snackbar">
            {{snackbarText}}
        <v-btn flat class="txt-ff" @click.native="snackbar = false">Close</v-btn>
       </v-snackbar>
		<v-toolbar class="monument-header">
		  <v-layout row wrap class="m0">
				<v-flex xs1 class="header_arrow_back">
			  <v-icon @click="loginBack()">arrow_back</v-icon>
			</v-flex>
			  <v-flex xs9 class=""><div class="lh15 fs20">Login to Yatra</div></v-flex>
		  </v-layout>
		</v-toolbar>
		<div class="p20">
<!--
			<v-radio-group v-model="ex8" :mandatory="false" class="input-guest">
                <v-layout wrap row>
                     <v-flex xs6>
                        <v-radio color="primary" label="Continue As Guest" value="guest" class="dib" small></v-radio>
                    </v-flex> 
                     <v-flex xs6>
                        <v-radio  color="primary" label="I have a Yatra Account" value="user" class="dib"></v-radio>
                    </v-flex> 
                </v-layout>
            </v-radio-group>
-->
			<v-form v-model="valid" ref="form">
				<v-text-field label="Email ID"
                              v-model="emailId"
                              class="pb0"
                              ref="loginEmail"
                              required
                              :rules="submitted ? Email_rules:[]">
               </v-text-field>
<!--
                <v-layout row wrap>
                <v-flex xs3 class="" v-if="ex8=='guest'">
						<v-text-field label="ISD Code" v-model="selectedTelephoneCode" class="pb0" @click="telephoneDialog" v-on:keypress="telephoneDialog"></v-text-field>
					</v-flex>
					<v-flex xs8 offset-xs1 class="" v-if="ex8=='guest'">
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
                </v-layout>
-->
                <v-text-field v-if="ex8=='user'" name="input-10-2"
                              label="Enter your password"
                              hint=""
                              min="8"
                              ref="loginPassword"
                              :rules="submitted ? password_rules:[]"
                              :append-icon="e3 ? 'visibility_off' : 'visibility'"
                              :append-icon-cb="() => (e3 = !e3)" :type="e3 ? 'text' : 'password'" v-model="password" required>
               </v-text-field>
<!--                <div class="loginBtn redBtn" v-if="ex8=='guest'" @click.stop="submitGuest">CONTINUE AS GUEST</div>-->
               <div class="loginBtn redBtn" v-if="ex8=='user'" @click.stop="submitLogin">Login</div>
			</v-form>
		</div>
		 <div class="registerTab">
             <v-layout row wrap>
                 <v-flex xs5 class="txt_blue" @click="navigateToRegister()">Register</v-flex>
                 <v-flex xs7  class="txt_blue txt-r" @click="navigateToForgotPass()">Forgot Password</v-flex>
             </v-layout>
		</div>
		<face-book-block @openLinkedAccount="openlinkedDialog = true"  @paymentRedirect="redirectToPayment"></face-book-block>
    <loader-view v-if="showLoader"></loader-view>
	</v-app>
</template>

<script>
import { checkLogin } from "../api/api";
import { checkRegister } from "../api/api";
import {createRouter} from '../router'
export default {
  components: {
    FaceBookBlock: () => import("../components/common/facebook.vue"),
    LoaderView : () => import('../components/common/loader.vue')
  },
  data() {
    return {
      emailId: "",
      valid: false,
      password: "",
      ex8: "user",
      selectedTelephoneCode: "+91",
      phoneNumber: "",
      channel: "b2c",
      monumentProductId: "yatrapwamonuments",
      password_rules: [v => !!v || "Password is required"],
      Email_rules: [
        v => !!v || "Email addresss is required",
        v =>
          /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
            v
          ) || "Enter correct Email Address"
      ],
      Phone_rules: [
        v => !!v || "Phone Number is required",
        v =>
          /^\d{10}$/.test(v) || v.length == 0 || "Please enter valid phone no"
      ],
      submitted: false,
      e3: false,
      snackbar: false,
      snackbarText: "",
      timeout: 3000,
      y: "bottom",
      showLoader: false,
      showRegisterMessage: false,
      loginDialog: false
    };
  },
  methods: {
    loginBack () {
      this.$router.go(-1);
      this.$store.commit('setExitMonument', {})
    },
    submitLogin() {
      this.submitted = true;
      if (this.$refs.form.validate() && this.$refs.form.value) {
        let postData = {
          emailId: this.emailId,
          password: this.password,
          includeOptionalParams: "true",
          productId: this.monumentProductId,
          channel: this.channel
        };
        let self = this;
        self.showLoader = true;
        checkLogin(postData).then(
          response => {
            if (response.data.authMode == "FACEBOOK") {
              if (response.data.responseCode == "104") {
                let userInfo = {
                  email: response.data.socialEmailId,
                  mob: response.data.customerDetails.mobileNum || '',
                  mobileISD: response.data.customerDetails.mobileISDCode || ''
                };
                self.setUserInfo(userInfo);
                // updating local storage
                localStorage.setItem("isLoggedIn", true);
                self.$store.commit("setUserInfoData", userInfo);
                localStorage.setItem("setUserInfoDataEmail", userInfo.email);
                localStorage.setItem("setUserInfoDataMob", userInfo.mob);
                localStorage.setItem( "setUserInfoDataMobileISD",userInfo.mobileISD);
                self.$store.commit("setSToken", response.data.ssoToken);

                if(self.$store.getters.getAppFlow == 'normal') {       
                  self.$router.push({ name: "AddTravellersView" });
                }
                else {
                  console.log('submit login')
                  self.$router.go(-1)
                }
                //self.redirectToPayment(response.data.ssoToken);
              } else {
                self.snackbar = true;
                self.snackbarText = response.data.responseMessage + 'or try other method.';
                self.showLoader = false;
              }
            } else {
              if (response.data.status == "SUCCESS") {
                let userInfo = {
                  email: response.data.responseData.userInfo.email,
                  mob: response.data.responseData.userInfo.mobile,
                  mobileISD: response.data.responseData.userInfo.mobileISD
                };
                localStorage.setItem("isLoggedIn", true);
                self.$store.commit("setUserInfoData", userInfo);
                localStorage.setItem("setUserInfoDataEmail", userInfo.email);
                localStorage.setItem("setUserInfoDataMob", userInfo.mob);
                localStorage.setItem( "setUserInfoDataMobileISD",userInfo.mobileISD);
                self.$store.commit("setSToken", response.data.ssoToken);
                if(self.$store.getters.getAppFlow == 'normal') {       
                  self.$router.push({ name: "AddTravellersView" });
                }
                else {
                  console.log('submit login')
                  self.$router.go(-1)
                }
              } else {
                self.snackbar = true;
                self.snackbarText = response.data.responseMessage;
                self.showLoader = false;
              }
            }
          },
          function(response) {
            self.snackbar = true;
            self.snackbarText = response.data.responseMessage
              ? response.data.responseMessage
              : "Some Error occured . Try after sometime";
            self.showLoader = false;
          }
        );
      }
    },
    formIsValid() {
      var emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return (
        this.emailId !== "" &&
        this.phoneNumber !== "" &&
        emailPattern.test(this.emailId) &&
        this.phoneNumber.length == 10
      );
    },

//    submitGuest() {
//      this.submitted = true;
//      if (
//        this.$refs.form.validate() &&
//        this.$refs.form.value &&
//        this.formIsValid()
//      ) {
//        let postData = {
//          email: this.emailId,
//          mobile: this.phoneNumber,
//          mobileISD: this.selectedTelephoneCode,
//          includeOptionalParams: true,
//          channel: this.channel,
//          productId: this.monumentProductId
//        };
//        var userInfo = {
//          email: this.emailId,
//          mob: this.phoneNumber,
//          mobileISD: this.selectedTelephoneCode
//        };
//        this.$store.commit("setUserInfoData", userInfo);
//        localStorage.setItem("setUserInfoDataEmail", userInfo.email);
//        localStorage.setItem("setUserInfoDataMob", userInfo.mob);
//        localStorage.setItem("setUserInfoDataMobileISD", userInfo.mobileISD);
//        this.showLoader = true;
//        let self = this;
//
//        checkRegister(postData).then(
//          response => {
//            if (response.data.status == "SUCCESS") {
//              localStorage.setItem("isLoggedIn", true);
//              if(self.$store.getters.getAppFlow == 'normal') {                
//                self.$router.push({ name: "AddTravellersView" });
//              }
//              else {
//                console.log('submit guest')
//                self.$router.go(-1)
//              }
//            } else {
//              self.snackbar = true;
//              self.snackbarText = response.data.responseMessage;
//              self.showLoader = false;
//            }
//          },
//          function(response) {
//            self.snackbar = true;
//            self.snackbarText = response.data.responseMessage
//              ? response.data.responseMessage
//              : "Some Error occured . Try after sometime";
//            self.showLoader = false;
//          }
//        );
//      }
//    },
    navigateToDetail() {
      let id = localStorage.getItem("monument_Id");
      this.$router.push({
        path: "/pwa/monuments/details",
        query: { monumentId: id }
      });
    },
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    telephoneDialog() {
      this.showTelephoneDialog = true;
    },
    navigateToRegister() {
      this.$router.push({ name: "RegisterView" });
    },
    navigateToForgotPass() {
      this.$router.push({ name: "ForgotPasswordView" });
    },
    redirectToPayment() {
      if (this.loginOption == "p2p") {
        this.loginDialog = false;
        this.loginOption = "";
        this.showLoader = false;
        this.$emit("cabsPPLogin", {});
      } else {
        if (this.getCabFareDetails.fare_details.price.advance_charge) {
          this.showLoader = false;
          router.push({ name: "PaySwift" });
        } else {
          let createOrderDetails = {
            travel_type: this.getcabsSRPData.travel_type,
            search_id: this.getcabsSRPData.search_id,
            fare_id: this.getCabFareDetails.fare_id,
            gst_details:
              this.getGSTDetailsForm.gst_details.address != ""
                ? this.getGSTDetailsForm.gst_details
                : {}
          };
          let self = this;
          this.$http.post("cabs/v1/orders", createOrderDetails).then(
            function(response) {
              self.showLoader = false;
              if (response.status == 200) {
                router.push({ name: "CabsConfirmation" });
              }
            },
            function(response) {
              self.showLoader = false;
            }
          );
        }
      }
    }
  }
};
</script>
<style lang="stylus">
.login-view {
	background: #fff;
}
.m0 {
  margin: 0 !important;
}

.p20 {
  padding: 10px 16px 20px 16px;
}

.registerTab {
  padding: 0 20px;

  .txt_blue {
    color: #1976d2;
  }

  .txt-r {
    text-align: right;
  }
}

.facebook {
  padding: 16px;

  .face-btn {
    background-color: #3b5998;
    color: #fff;
    text-align: center;
    padding: 10px;
    border-radius: 3px;
    font-size: 15px;
    font-weight: 500;
    width: 100%;
  }
}

.input-guest {
  label {
    font-size: 11px;
    color: rgba(0, 0, 0, 54);
  }

  .input-group__details {
    display: none;
  }
}

.application.theme--light {
  background: #fff;
}
</style>

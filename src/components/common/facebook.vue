  <template>
     <div class="">
      <v-container fluid>
       <v-snackbar class="snacktxt" :timeout="timeout" :bottom="y === 'bottom'" v-model="snackbar">
            {{snackbarText}}
        <v-btn flat class="txt-ff" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
          <v-layout row wrap>
              <v-flex xs12 class="facebookbtn"
                :params="fbSignInParams"
                @success="onSignInSuccess"
                @error="onSignInError"
                @click="FB_Login">
                Login with Facebook
              </v-flex>             
          </v-layout>
      </v-container>
	  </div>
  </template>
  <script>
	  import {checkFacebook} from '../../api/api'
  export default {
    data() {
      return {
        fbSignInParams: {
          scope: 'email, user_likes',
          return_scopes: true
        },
        snackbar: false,
        snackbarText:'',
        timeout: 3000,
        y: 'bottom',
        showLoader: false,
      }
    },

    mounted () {
      window.fbAsyncInit = function() { 
      FB.init({ 
          appId : '326464424135609',
          cookie : true, 
          xfbml : true, 
          version : 'v2.8'
        }); 
      }; 
      (function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = "//connect.facebook.net/en_US/sdk.js"; fjs.parentNode.insertBefore(js, fjs); }
        (document, 'script', 'facebook-jssdk'));
    },

    methods: {
      onSignInSuccess (response) {
        var self = this;
        this.showLoader = true
        FB.api('/me', dude => {
          if(response.status === "connected") {
             self.fblogin(response.authResponse.accessToken);
          }
        })
      },
	 FB_Login(){
           var self = this;
           FB.login(function(response) {
                FB.api('/me', dude => {
                    self.fblogin(response.authResponse.accessToken);
                })
            });
       },	
      onSignInError (error) {
        this.showLoader = false
        this.snackbar = true
        this.snackbarText = "Some Error has occured. Try after sometimes"
      },
      fblogin (accessToken) {
          let postData = {
            authMode: "FACEBOOK",
            loginStep: "ResponseCheck",
            accessToken: accessToken,
            sourcepage: "",
            includeOptionalParams: true,
            channel: "b2c",
            productId: "yatrapwamonuments"
          }
          let self = this
         	checkFacebook(postData).then(response => {
            if (response.data.customerDetails && Object.keys(response.data.customerDetails).length>0) {
              if(!response.data.isLinkedAccount) {
                let userInfo = {
                  'email': response.data.socialEmailId,
                  'mob': response.data.customerDetails.mobileNum ? response.data.customerDetails.mobileNum : null,
                  'mobileISD': response.data.customerDetails.mobileISDCode ? response.data.customerDetails.mobileISDCode : null
                 } 
                self.showLoader = false
                self.setUserInfo(userInfo)
                // updating local storage
                localStorage.setItem("isLoggedIn", true);
                self.$store.commit("setUserInfoData", userInfo);
                localStorage.setItem("setUserInfoDataEmail", userInfo.email);
                localStorage.setItem("setUserInfoDataMob", userInfo.mob);
                localStorage.setItem( "setUserInfoDataMobileISD",userInfo.mobileISD);
                self.$store.commit("setSToken", response.data.ssoToken);
              } else {
                   if(self.$store.getters.getAppFlow == 'normal') {
                      self.$router.push({ name: "AddTravellersView" });
                    }
                    else {
                      console.log('submit login')
                      self.$router.go(-1)
                    }
              }
            } else {
              self.snackbar = true
              self.snackbarText = response.data.responseMessage
              self.showLoader = false
            }
           }, function (response) {
              self.snackbar = true
              self.snackbarText = 'Some Error occured . Try after sometimes'
              self.showLoader = false
          });
      }
    }
  }
  </script>

  <style scoped>
  .p15 {
      padding: 10px 0;
  }
       .facebookbtn {
        background-color: #3B5998;
        color: #fff;
        text-align: center;
        padding: 8px;
        border-radius: 3px;
        font-size: 15px;
        font-weight: 500;
           width: 100%;
    }
    .tc {
        font-size: 12px;
        text-align: center;
        margin: 10px 0;
    }
	  .container {
		  padding: 16px;
	  }
    .application.theme--light {
      background: #fff;
    }
  </style>

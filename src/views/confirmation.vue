<template>
  <v-app>
      <div class="bg-color confirmation">
      <div class="wrapper-width clearfix" v-if="Object.keys(confirmationData).length >0">
          <section class="user-info clearfix">
              <div class="tick-icon" v-if="confirmationData.data.bookingStatus.toLowerCase() == 'confirmed'">
                <img class=""  src="../assets/icons/success.png">
              </div>
              <div class="tick-icon" v-if="confirmationData.data.bookingStatus.toLowerCase() == 'pending'">
                <img class=""  src="../assets/icons/pending.png">
              </div>
              <div class="tick-icon" v-if="confirmationData.data.bookingStatus.toLowerCase() == 'failed'">
                <img class=""  src="../assets/icons/failed.png">
              </div>
              <div class="user-msg">
                <p class="text-dark bold mb5">Dear Customer</p>
                <p class="text-lght">{{confirmationData.data.bookingMessage}}. Reference no- <span class="bold">{{confirmationData.data.superpnr}}</span></p>
              </div>
          </section> 

          <section class="msg-info">
              <p v-if="confirmationData.data.bookingStatus.toLowerCase() == 'confirmed'">Your booking is <span class="bold">{{confirmationData.data.bookingStatus.toLowerCase()}}</span> and your voucher has been mailed to you. Please carry a printout of your ticket along with a vaild government issued photo ID to the monument</p>
              <p v-if="confirmationData.data.bookingStatus.toLowerCase() == 'pending'">{{confirmationData.data.bookingMessage}} and you will receive the ticket in some time. You can check the status of you booking and download the ticket through <span class="bold">MyBookings</span></p>
              <p v-if="confirmationData.data.bookingStatus.toLowerCase() == 'failed'">We were unable to process your request. This can happen due to incorrect transaction amount, internal technical glitch or some unknown error. Kindly, write to monumenttickets@yatra.com and do mention your Booking Reference Number for further resolution.</p>
          </section>

          <section class="contact-info">
            <p class="text-upper mb15">booking details have been sent to contact details given below</p>
            <div class="edit-detail">
              <ul>
                <li class="resp-sec">
                  <span class="call-icon">
                    <img src="../assets/icons/icon-call.png">
                  </span>
                  <span class="code">+91</span>
                  <span class="name"><input type="text" v-model="confirmationData.data.userDetails.phone.number" maxlength="10">
                      <span class="error-message" v-if="submittedSMS && confirmationData.data.userDetails.phone.number.length !=0 && confirmationData.data.userDetails.phone.number != ''">Please enter correct mobile no</span>
                      <v-dialog v-model="dialog" persistent max-width="290">
                        <v-card>
                        <v-card-text>{{successSMSMessage}}</v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="darken-1" flat @click.native="dialog = false">Ok</v-btn>
                        </v-card-actions>
                        </v-card>
                      </v-dialog>
                  </span>
                  <span class="edit-name text-upper" @click="resendSMS()"><a>resend</a></span>
                </li>
                <li class="resp-sec">
                  <span class="mail-icon"><img src="../assets/icons/icon-mail.png"></span>
                  <span class="mail"><input type="text" v-model="confirmationData.data.userDetails.email" name="">
                    <span class="error-message" v-if="submittedEmail && confirmationData.data.userDetails.email != '' && ! /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(confirmationData.data.userDetails.email)">Please enter correct email</span>
                    <v-dialog v-model="dialog1" persistent max-width="290">
                      <v-card>
                      <v-card-text>{{successEmailMessage}}</v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="darken-1" flat @click.native="dialog1 = false">Ok</v-btn>
                      </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </span>
                  <span class="edit-mail text-upper" @click="resendEmail()"><a>resend</a></span>
                </li>
              </ul>
            </div>
          </section>
          <section class="booking-details">
            <p class="text-upper mb15">booking details </p>
            <div class="inner-details clearfix" v-for="(monument, index) in confirmationData.data.monumentDetails" :key="index">
                <div class="left-sec">
                    <img :src="confirmationData.data.monumentDetails[index].imageUrl">
                </div>
                <div class="right-sec">
                  <p class="title" v-html="confirmationData.data.monumentDetails[index].monumentTitle"></p>
                  <p class="add text-lght">{{confirmationData.data.monumentDetails[index].address}}</p>
                  <p class="view-map" @click="openGoogleMaps()"><a>View on Map</a></p>
                  <p class="date"><span class="bold">Travel Date -</span>{{getVisitDate(confirmationData.data.monumentDetails[index].visitDate)}}</p>
                  <p class="hour"><span class="bold">Opening Hours -</span> {{confirmationData.data.monumentDetails[index].openTime}} - {{confirmationData.data.monumentDetails[index].closeTime}}</p>
                </div>
            </div>
          </section>

          <section class="guest-details">
            <p class="text-upper">Guest Details</p>

              <!-- <div class="guest-inner" v-for="(guestDetails,index) in confirmationData.data.payUMoneyBookingDetails" :key="index">
                <div class="clearfix">
                  <p class="mt10 mb10" v-if="guestDetails.isAdult == true">Adult</p>
                  <p class="mt10 mb10" v-if="guestDetails.isAdult == false">Child</p>
                  <div class="left-sec"> 
                     <p><span class="bold text-upper">Name - </span>{{guestDetails.name}}</p>
                     <p><span class="bold text-upper">Age - </span>{{guestDetails.age}}</p>
                  </div>
                  <div class="right-sec">
                    <p><span class="bold text-upper">Tourist type - </span>{{guestDetails.nationality.group}}</p>
                    <p><span class="bold text-upper">Country - </span>{{guestDetails.nationality.country}}</p>
                  </div>
                </div>
              </div> -->

              <div class="guest-inner" v-for="(guestDetails,index) in confirmationData.data.monumentDetails[Object.keys(confirmationData.data.monumentDetails)[0]].paxInfo" :key="index">
                <div class="clearfix">
                  <div class="left-sec"> 
                     <p><span class="bold text-upper">Name - </span>{{guestDetails.gender}} {{guestDetails.name}}</p>
                     <p><span class="bold text-upper">Age - </span>{{guestDetails.age}} , {{guestDetails.paxType}}</p>
                  </div>
                  <div class="right-sec">
                    <p><span class="bold text-upper">Tourist type - </span>{{guestDetails.countryGroup}}</p>
                    <p><span class="bold text-upper">Country - </span>{{guestDetails.countryName}}</p>
                  </div>
                </div>
              </div>
              
          </section>

          <section class="payment-sec">
            <p class="text-upper mb15">Payment Summary</p>
            <div class="payment-inner">
              <div v-for="(monument, index3) in confirmationData.data.monumentDetails" :key="index3">
                  <strong>{{monument.shortTitle}}</strong>
                  <ul v-for="(paxDetails,index) in confirmationData.data.monumentDetails[index3].fareBreakUp" :key="index">
                    <li class="text-upper mb5">{{index}}</li>
                    <li class="fs-sm" v-for="(travellerDetails,index1) in paxDetails" :key="index1">
                      <span class="text-left text-lght">{{travellerDetails.description}}</span>
                      <span class="text-right"><span>&#8377;</span> {{Math.ceil(travellerDetails.fmtAmount)}} </span>
                    </li>
                  </ul>
              </div>    
              <ul>
                <li class="bdr">
                  <span class="text-left">Total Amount Paid</span>
                  <span class="text-right" v-if="confirmationData.data.totalAmounPaid"><span>&#8377;</span> {{Math.ceil(confirmationData.data.totalAmounPaid)}} </span>
                  <span class="text-right" v-if="!confirmationData.data.totalAmounPaid"><span>&#8377;</span> Not Paid </span>
                </li>
              </ul>
            </div>
          </section>

          <section class="term-c">
              <p class="fs-md mb15 mt15">Important Information</p>
              <ul>
                  <li>The e-ticket is not transferable.</li>
                  <li>Entry Fee is not refundable.</li>
                  <li>E-ticket cancellations are not permitted.</li>
                  <li>The Monument is open for visitors between sunrise and sunset.</li>
                  <li>Visitor shall be required to show photo identity proof in original at the entry to the monument.</li>
                  <li>Edibles are not allowed inside the monument.</li>
                  <li>Inflammable/dangerous/explosive articles are not allowed.</li>
              </ul>
          </section>
          <div class="book-btn" @click="navigateToSrp()">BOOK ANOTHER TICKET</div>
      </div>
      </div>
      <loader-view v-if="showAjaxLoading"></loader-view>
      <ul class="additional-footer">
        <li>
          <a target="_blank" href="http://asitickets.com/asi/home/"><i class="ico-sprite ico-asi"></i></a>
        </li>
        <li>
            <a target="_blank" href="http://indiaculture.nic.in/"><i class="ico-sprite ico-culture"></i></a>
        </li>
        <li>
            <a target="_blank" href="https://incredibleindia.org/"><i class="ico-sprite ico-inc"></i></a>
        </li>
      </ul>
      <div id="footerHTML" style="display:none"></div>
  </v-app>
</template>
<script>
 import {confirmationDataAPI,resendSMSAPI,resendEmailAPI,getFrescoHeader,getFrescoFooter,deleteMonumentFromCartAPI,getCartItems,retrieveCartAPI} from '../api/api'
 export default {
   data (){
    return {
     confirmationData:{},
     showAjaxLoading:false,
     submittedSMS : false,
     successSMSMessage : '',
     submittedEmail : false,
     successEmailMessage : '',
	   dialog : false,
	   dialog1: false,
	   countryCode: 91
    } 
   },
   components :{
     LoaderView : () => import('../components/common/loader.vue')
   },
   mounted (){
      let self = this
      this.showAjaxLoading = true
      self.emptyCart()
      localStorage.clear()
   },
	 created(){
		 this.getConfirmationData()
	 },
   methods :{
     emptyCart() {
       var self = this
       retrieveCartAPI().then(function(response){
          self.cartId = response.data.cartId
          getCartItems(self.cartId).then(response => {
            self.cartDataId = response.data.itemList
            let cartIds = self.cartDataId.map(function(item, index){
                return item.itemId
            })
            deleteMonumentFromCartAPI(cartIds, self.cartId)
          }).catch(function(error){
            console.log("emprtycart", error)
          })
       })
     },
     resendSMS(){
        if(this.confirmationData.data.userDetails.phone.number == '' || this.confirmationData.data.userDetails.phone.number.length != 10) {
			    this.submittedSMS = true
			    return false
        }
        let self = this
        resendSMSAPI(this.confirmationData.data.superpnr,this.countryCode + this.confirmationData.data.userDetails.phone.number).then(function (response) {
          self.submittedSMS = false
		      self.dialog = true	
          self.successSMSMessage = 'SMS has been sent on the mobile number'
          }).catch(function (e) {
            console.log(e)
          })
     },
	   navigateToSrp () {
        this.$router.push({name:'MonumentSRPView'})
      },
     resendEmail (){      
         if(this.confirmationData.data.userDetails.email == '' ||  !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.confirmationData.data.userDetails.email)){
			      this.submittedEmail =true 
            return false
         }
         let self = this
         resendEmailAPI(this.confirmationData.data.superpnr,this.confirmationData.data.userDetails.email).then(function (response) {
            self.submittedEmail = false
			      self.dialog1 = true	 
            self.successEmailMessage = 'Email has been sent successfully'
            }).catch(function (e) {
              console.log(e)
            })
     },
	   openGoogleMaps (){
       window.open(`https://www.google.com/maps/?q=${this.confirmationData.data.monumentDetails[Object.keys(this.confirmationData.data.monumentDetails)[0]].locationInfo.latitude},${this.confirmationData.data.monumentDetails[Object.keys(this.confirmationData.data.monumentDetails)[0]].locationInfo.longitude}`)
     },
     getConfirmationData (){
        let self = this
        confirmationDataAPI(this.$route.query.ttid).then(function (response) {
           self.confirmationData = response.data
           self.showAjaxLoading = false
        }).catch(function (e) {
           self.confirmationData = e.response.data
           self.showAjaxLoading = false
        })
     },
     getVisitDate (date){
       let d = new Date(date)
       return d.getDate()+'/'+this.getMonthName(d)+'/'+d.getFullYear()
     },
     getMonthName (date){
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        return monthNames[date.getMonth()]
     }
   }
 }
</script>


<style scoped="true" lang="scss">
  .wrapper-width{
    margin-bottom: 4%;
  }
  a{
    color: #57a9e0;
  }
  .bg-color{
    background: #e2e2e2;
    padding: 0 0 20px;
  }
   p{
      margin-bottom: 10px !important;
      font-size: 14px;
   }
   .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }
  .clearfix:after {
     content: " "; /* Older browser do not support empty content */
     visibility: hidden;
     display: block;
     height: 0;
     clear: both;
  }
  .mb10{
    margin-bottom: 10px;
  }
  .mt10{
    margin-top: 10px;
  }
   .bold{
    font-weight: bold;
   }
   .text-dark{
    color: #333;
   }
   .text-lght{
    color: #666;
   }
   .text-upper{
    text-transform: uppercase;
   }

   .user-info{
      padding:  3% 0 0;
   }
   .tick-icon{
      width: 5%; float: left;
   }
   .user-msg{
      width: 95%;
      float: left;
   }
   .msg-info{
      margin: 20px 0 0;
      padding: 15px;
      background: #2b4e72;
      color: #fff;
      border-radius: 4px;
      p{
        font-size: 14px; margin-bottom: 0;
      }
   }

   .contact-info{
      margin: 20px 0 0;
      .edit-detail{
        ul {
            background: #fff;
            padding: 20px;
            border-radius: 4px; 
            border: 1px solid #ddd;
          li{
            display: inline-block;
            width: 100%;
          }
          .call-icon{
              background: #e4e4e4;
              padding: 10px 15px;
              border-radius: 4px;
              margin: 0 10px 0 0;
              height: 45px;
            }    
          .code{
            padding: 13px 20px;
            border-radius: 4px;
            margin: 0 10px 0 0;
            border: 1px solid #ddd;
            height: 45px;
          }
          .name{
            position: relative;
            input{
              border: 1px solid #ddd;
              padding:10px 15px;
              height: 45px;
            }
            .error-message{
              font-size: 12px;
              position: absolute;
              width: 100%;
              top: 25px;
              left:0px;
            }
          }

            .edit-name{
                margin: 0 20px 0 0;
                width: 15%;
                a{
                  font-size: 14px;
                }
            }
            .edit-mail{
              a{
                 font-size: 14px;
              }
            }
            .mail-icon{
			  background: #e4e4e4;
			  padding: 10px 15px;
			  height: 45px;
			  border-radius: 4px;
			  margin: 0 10px 0 0;
			  display: inline-block;
            }

             .mail{
				  position: relative;
				  width: 25%;
              input{
                 border: 1px solid #ddd;
                 padding:10px 15px;
				 height: 45px;
				 width: 100%;
              }
            .error-message,.success-message{
				  font-size: 12px;
				  position: absolute;
				  width: 100%;
				  left: 0;
				  top: 25px;
				color: red;
				}
          	}
          }
        }
      }
      .bdr{
        padding: 10px 0;
        border-top: 1px solid #ddd;
        border-bottom:  1px solid #ddd;
      }
    .booking-details{
        margin: 20px 0 0;
        .inner-details{
          background: #fff;
          border: 1px solid #dddddd;
          .ttile{
            font-size: 18px !important;
          }
        }
        .left-sec{
          width: 40%; float: left;
          img{
              width: 100%;
          }
        }
        .right-sec{
          width: 60%; float: left;
          padding: 15px;
        }
    }

    .guest-details{
        width: 50%; float: left;
        margin: 20px 0 0 0;

       
        .guest-inner{
          background: #fff; padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          min-height: 200px;
          .left-sec{
            width: 50%; float: left;
          }
          .right-sec{
             width: 50%; float: left;
          }
        }
    }
    .payment-sec{
      width: 46%; float: right;
      margin: 20px 0 0 4%;
      
      .payment-inner{
         background: #fff; padding: 15px;
         min-height: 290px;
         border: 1px solid #ddd;
         border-radius: 4px;
         li{
          margin: 0 0 10px;
         }
         .text-left{
              width: 48%;
            display: inline-block;
         }
         .text-right{
            width: 48%;
            display: inline-block; text-align: right;
         }
      }
      .fs-sm {
         font-size: 14px;
      }
      .mb5{
          margin-bottom: 5px;
      }
    }
    .mb5{
          margin-bottom: 5px;
      }
      .term-c{
            
            clear: both;
            display: inline-block;
           
        .fs-md{
          font-size: 14px; text-transform: uppercase;
        }
        ul{
          list-style: decimal !important;
          background: #fff;
           padding: 20px;
            li{
                margin-bottom: 10px;
                list-style-type: disc;
                color: #666;
                font-size: 14px;
                padding-left: 0;
                margin: 0 00 10px 15px;
            }
          }
      }
	.mb15 {
		margin-bottom: 15px !important;
	}
	.mt15 {
		margin-top: 15px !important;
	}
	.title {
		display: inline-block;
		margin-bottom: 10px !important;
	}
	.book-btn {
		width: 100%;
		text-align: center;
		background: #ea2330;
		color: #fff;
		padding: 10px;
		border-right: 1px solid #fff;
		margin-top: 16px;
	}
    @media only screen and (max-width: 768px) {
      .wrapper-width{
          width: 96%; margin: 0 Auto;
      }
      .tick-icon{
        width: 15%;
      }
      .user-msg{
        width: 85%;
      }
      .msg-info{
        margin: 10px 0 0;
      }
      .booking-details{
          .left-sec{
            width: 100%;
          }
          .right-sec{
              width: 100%;
          }
        } 
        .guest-details{
          width: 100%;
          .guest-inner{
            min-height: inherit;
            .left-sec{
              width: 100%;
            }
            .right-sec{
              width: 100%;
            }
          }
        }
        .payment-sec{
           width: 100%;
           .payment-inner{
             min-height: inherit;
           }
        }
        .resp-sec{
          clear: both;
          display: inline-block;
          margin-bottom: 15px;
          .mail-icon{
             margin-right: 10px !important;
             padding: 5px 10px !important;
             height: 30px !important;
             margin-bottom: 15px !important;
          }
          input, .code{
            height: 30px !important;
          }
          input{
                width: 60%;
    			vertical-align: top;
          }
          .call-icon{
            padding: 5px 10px !important;
            height: 30px !important;
            margin: 0 10px 15px 0px !important;
			display: inline-block;
          }
          .code{
                padding: 5px 10px !important;
            font-size: 14px;
            height: 30px !important;
            margin: 0 10px 0 0px !important;
            position: relative;
            top: -6px;
          }
        }
        .edit-detail{
          .mail{
                width: auto !important;
          }
        }
		.contact-info {
			.edit-detail {
				ul {
					.mail {
						input {
							width: 81%;
						}
					}
				}
			}
		}
    }

</style>

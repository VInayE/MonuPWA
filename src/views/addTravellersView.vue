<template>
    <v-app name="monument-traveller" >
        <v-toolbar class="monument-header">
            <v-layout row wrap class="m0">
                <v-flex xs1 class="header_arrow_back">
                    <v-icon @click="navigateToDetails(monumentId)">arrow_back</v-icon>
                </v-flex>
                <v-flex xs9 class="lh29 fs20">Enter Visitor Details</v-flex>
            </v-layout>
            <div v-if="savedPaxInfo.length > 0">                
                <v-bottom-sheet v-model="openSaveList">
                <v-icon slot="activator" v-bind:class="{ highlighter: savedPaxInfo.length > 0 }">person_add</v-icon>              
                    <v-list>
                    <v-layout row wrap  v-for="(paxInfo,index) in savedPaxInfo" :key="index">
                        <v-flex xs6>{{paxInfo.name}}</v-flex>
                        <v-flex xs3 @click="editTravellerInfo(index);openSaveList=false" class="edit-pax">Edit</v-flex>
                        <v-flex xs3 @click="deletePaxInfo(index);openSaveList=false" class="del-pax">Delete</v-flex>
                    </v-layout>
                    </v-list>
                </v-bottom-sheet>
                <div class="no-of-saved-pax" v-if="savedPaxInfo.length > 0">{{savedPaxInfo.length}}</div>
            </div>
        </v-toolbar>
        <v-card color="" flat class="mt10">
            <v-card-text>
                <v-container fluid>
                    <form>
                        <v-layout row wrap>
                           <v-flex xs12 class="fs18">Add Visitor Name</v-flex>
                            <v-flex>
                                <v-select
                                 v-bind:items="titleData"
                                 v-model="paxInfoData.gender"
                                 label="Title"
                                 single-line
                                 bottom
                                 item-text="text"
                                 item-value="text"
                                ></v-select>
                            </v-flex>
                            <div class="error-message pabs" v-if="submittedTab2 && paxInfoData.gender == 'TITLE'">Please Enter Title</div>
                        </v-layout>                        
                        <v-text-field
                         label="Visitor Name"
                         v-model="paxInfoData.name"
                        ></v-text-field>
                        <div class="error-message pabs" v-if="submittedTab2 &&paxInfoData.name == ''">Please Enter Visitor Name</div>
                        <v-select
                         label="Age"
                         v-model="paxInfoData.age"
                         :items="ageData"
                         item-text="text"
                         item-value="text"
                         required
                        ></v-select>
                        <div class="error-message" v-if="submittedTab2 && paxInfoData.age == 'AGE'">Enter your Age</div>
                        <v-select
                         label="Country Group"
                         v-if="masterData && Object.keys(masterData).length > 0 && masterData.visitors"
                         v-model="paxInfoData.countryGroup"
                         :items="Object.keys(masterData.visitors)"
                         item-text="$index"
                         item-value="$index"
                         @change="changesCountryGroup(paxInfoData.countryGroup)"
                         required
                        ></v-select>
                        <div class="error-message" v-if="submittedTab2 && paxInfoData.countryGroup == 'COUNTRY GROUP'">Please Select Country Group</div>
                        <v-select
                         label="Country"
                         v-if="masterData && Object.keys(masterData).length > 0 && masterData.visitors"
                         v-model="paxInfoData.countryName"
                         :items="masterData.visitors[paxInfoData.countryGroup]"
                         item-text="countryName"
                         item-value="countryName"
                         required
                        ></v-select>
                        <div class="error-message" v-if="submittedTab2 && paxInfoData.countryName == 'COUNTRY'">Please Select Country</div>
                        <div class="option fs18" @click="openOptionView = !openOptionView;">Options</div>
                        <div class="" v-if="(openOptionView==true)">
                            <v-select
                            label="Identity Type"
                            v-model="paxInfoData.identityType"
                            :items="['AADHAAR','PASSPORT','DRIVING LICENSE']"
                            required
                            ></v-select>
                            <v-text-field
                                label="Identity Number"
                                v-model="paxInfoData.identityNumber"
                            ></v-text-field>
                        </div>
                        <div>
                            <v-btn color="red-trans" @click="addTravellerList()">Add Visitor</v-btn>
                        </div>
                    </form>
                </v-container>
            </v-card-text>
        </v-card>
        <v-card color="mt10 contact-d" flat>
             <v-card-text>
                <v-container fluid>
                    <p class="fs18"> Contact Details </p>
                    <span class="c-999 fs14"> Your tickets details will be send here </span>
                    <v-text-field type="text" v-model="traveller.email_id" placeholder="Enter your Email" v-on:keypress="restrictSpecialChar"></v-text-field>
                    <div class="pabs error-msg">
                       <div class="error-message" v-if="submittedForm1 && traveller.email_id == ''">Please Enter Email ID</div>
                       <div class="error-message" v-if="submittedForm1 && traveller.email_id != '' && ! /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(traveller.email_id)">Please Enter Correct Email ID</div>
                    </div>
                    <v-text-field type="tel" v-model="traveller.telephone_no" placeholder="Mobile Number" v-on:keypress="validateTelephone()" maxlength='10'></v-text-field>
                    <div class="pabs error-msg">
                       <div class="error-message" v-if="submittedForm1 && traveller.telephone_no == ''">Please Enter Mobile No</div>
                       <div class="error-message" v-if="submittedForm1 && traveller.telephone_no != '' && traveller.telephone_no.length != 10">Please Enter Correct Mobile No</div>
                    </div>
                </v-container>
            </v-card-text>
        </v-card> 
        <div>
            <div class="redBtn" @click="saveTravellerDetails()">Continue</div>
        </div>
        <loader-view v-if="isAPICompleted"></loader-view>
        <v-snackbar :timeout="timeout" :bottom=" y === 'bottom'" :multi-line="true" v-model="snackbar">
            {{this.snackBarText}}
            <v-btn flat class="txt-ff close-snack" @click.native="snackbar === false">Close</v-btn>
        </v-snackbar>
    </v-app>
</template>
<script>
    import {fetchMasterDataAPI,fetchMonumentListDataAPI,getCompleteMonumentListData,getPaxDetails,getMasterDataFromJSON,saveMonumentListDataFromJSON,getMonumentListDataFromJSON,savePaxDetailsAPI,getReviewSummaryAPI,checkUserProfile} from '../api/api'
    import {initializeGoogleMaps} from '../helper/pwaMonumentMap'
    import axios from 'axios'
    
    export default {
        components: {
            LoaderView: () => import('../components/common/loader')
        },
        mounted () {
            let self = this
            if(Object.keys(this.$store.getters.getMasterData).length == 0) {
                axios.all([fetchMasterDataAPI()]).then(axios.spread(function (masterData) {
                    self.masterData =masterData.data.data 
                    self.$store.commit('setMasterData',masterData.data)
                })).catch(function (error) {
                    console.log(error, 'getMasterData')
                })  
            } else {
                self.masterData =this.$store.getters.getMasterData
                self.monumentListData =this.$store.getters.getMonumentListData 
            }
            
            self.monumentId = localStorage.getItem('monument_Id')
            //  to handle bookings coming from SEO page
            if (self.$route && self.$route.query.superPnr) {
                localStorage.setItem('superPnr', this.$route.query.superPnr)
            }
            self.superPnr = localStorage.getItem('superPnr')
            self.traveller.email_id = (localStorage.getItem('setUserInfoDataEmail') == null || localStorage.getItem('setUserInfoDataEmail') == 'null') ? "" : localStorage.getItem('setUserInfoDataEmail')
            self.traveller.telephone_no = (localStorage.getItem('setUserInfoDataMob') == null || localStorage.getItem('setUserInfoDataMob') == 'null') ? "" : localStorage.getItem('setUserInfoDataMob')
            self.availableDate = localStorage.getItem('availableDate')

            this.fetchingSavedDetails(self.superPnr);
        },
        watch: {
            // 'paxInfoData.countryGroup' : function(val) {
            //     this.paxInfoData.countryName = this.masterData.visitors[val][0].countryName
            // } 
        },
        methods:{
            checkUser() {
                var self = this
                let userLoginParams= {
                    includeOptionalParams:true,
                    channel:'B2C',
                    productId:'yatrapwamonuments'
                }
                checkUserProfile(userLoginParams).then(function(userInfo) {
                    if(userInfo.data.status == 'FAIL') {
                        this.$router.push({name:'LoginView'})
                    }
                    else {
                        self.traveller.email_id= userInfo.data.responseData.userInfo.email
                        self.traveller.telephone_no= userInfo.data.responseData.userInfo.mobile
                    }
                }).catch(function (error) {
                    console.log('Something wrong with checkApi request')
                })
            },
            changesCountryGroup(index) {
              let self = this
              setTimeout(function(){ 
                self.paxInfoData.countryName = self.masterData.visitors[self.paxInfoData.countryGroup][0].countryName
              }, 0);              
            },
            editTravellerInfo (index){
                this.paxInfoData = {
                'countryGroup':this.savedPaxInfo[index].countryGroup,
                'countryName':this.savedPaxInfo[index].countryName,
                'gender' :this.savedPaxInfo[index].gender,
                'age':this.savedPaxInfo[index].age.toString(),
                'paxType':this.savedPaxInfo[index].paxType,
                'name':this.savedPaxInfo[index].name,
                'identityType':this.savedPaxInfo[index].identityType =='' ?'IDENTITY TYPE':this.savedPaxInfo[index].identityType ,
                'identityNumber':this.savedPaxInfo[index].identityNumber
                }
                this.selectedGender = this.savedPaxInfo[index].gender
                this.savedPaxInfo.splice(index,1) 
            },
            navigateToDetails(id){
                this.$router.push({path: '/pwa/monuments/details', query: { monumentId: id }})
            },
            fetchingSavedDetails(superPnr) {
                let self = this  
                getPaxDetails(superPnr).then(function (response) {
                    self.savedPaxInfo=response.data.data.monumentBookingDetails[localStorage.getItem('monument_Id')].paxInfo;
                }).catch(function (error) {
                        console.log(error)
                        //  self.showTravellerAPIError = error.body.responseInfo.errors
                        //  self.isAPICompleted = false
                })
            },
            deletePaxInfo(index){
                this.savedPaxInfo.splice(index,1) 
            }, 
            validateTab_1Form () {
                    var test = this.traveller.email_id != '' && /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.traveller.email_id) && this.traveller.telephone_no != '' && this.traveller.telephone_no.length == 10
                    return test
            }, 
            validateContinueTab_2 (){
                return this.paxInfoData.gender == 'TITLE' &&  this.paxInfoData.identityType =='IDENTITY TYPE' &&  this.paxInfoData.identityNumber == '' && this.paxInfoData.name == '' && this.paxInfoData.age == 'AGE' && this.paxInfoData.countryName == 'COUNTRY' && this.paxInfoData.countryGroup == 'COUNTRY GROUP'
            },  
            saveTravellerDetails(){
                var self = this
                this.submittedForm1 = true
                if(this.validateTab_1Form()){
                    this.submittedForm1 = false 
                    this.savePaxDetails.email = this.traveller.email_id
                    this.savePaxDetails.phone = {
                        'isd' :'91',
                        'number':this.traveller.telephone_no  
                    }
                    //need to be done
                    this.savePaxDetails.monumentPaxSummary = {
                        [self.monumentId] : {}
                    }
                } else {
                    return false 
                }
                if(this.savedPaxInfo.length > 0) {
                        if(this.validateContinueTab_2 ()) {
                        this.submittedTab2 = false
                        this.savePaxDetailsAPI ()
                        } else if(this.validateForm2()){
                        this.addTravellerListData ()
                        this.submittedTab2 = false
                        this.savePaxDetailsAPI()
                    } else {
                        this.submittedTab2 = true
                    }
                } else if(this.savedPaxInfo.length == 0) {
                    this.submittedTab2 = true
                    if(this.validateForm2()){
                        this.addTravellerListData ()
                        this.submittedTab2 = false
                        this.savePaxDetailsAPI()
                    }
                }  
                
                
            },
            savePaxDetailsAPI (){
                let self = this
                let adultCount = 0,childCount = 0 ;
                for(let i=0 ; i < this.savedPaxInfo.length ; i++){
                    if(this.savedPaxInfo[i].paxType == "CHILD") {
                        childCount += 1
                    } else {
                        adultCount +=1 
                    }
                }
                var superPnr = localStorage.getItem('superPnr')
                var localData = {}
                getReviewSummaryAPI(superPnr).then(function (response) {
                    localData=response.data
                    var tempArray=[]
                    for(var key in localData.data.monumentsAvailability) {
                        tempArray.push(key)
                    }
                    //console.log("tempArray" + tempArray + " this.savedPaxInfo" + self.savedPaxInfo )m
                    self.savePaxDetails.monumentPaxSummary = {}

                    for(var key in localData.data.monumentsAvailability) {
                        for(var j=0; j<tempArray.length; j++) {
                            if(key == tempArray[j]) {
                                let a = tempArray[j]
                                //console.log(a)
                                self.savePaxDetails.monumentPaxSummary[a] = {}
                                self.savePaxDetails.monumentPaxSummary[a].visitDate = localData.data.monumentsAvailability[a].visitDate
                                if(localData && localData.data && localData.data.monumentsAvailability && localData.data.monumentsAvailability[a].timeSlot) {
                                    self.savePaxDetails.monumentPaxSummary[a].timeSlot = {
                                        'name':localData.data.monumentsAvailability[a].timeSlot.name,
                                        'startTime': localData.data.monumentsAvailability[a].timeSlot.startTime,
                                        'endTime': localData.data.monumentsAvailability[a].timeSlot.endTime
                                    }
                                }
                                self.savePaxDetails.monumentPaxSummary[a].adultCount = adultCount
                                self.savePaxDetails.monumentPaxSummary[a].childCount = childCount
                                self.savePaxDetails.monumentPaxSummary[a].paxInfo = self.savedPaxInfo
                            }
                        }
                    }
                    //console.log(self.savePaxDetails)
                    self.isAPICompleted = true
                    self.showTravellerAPIError = ''
                    savePaxDetailsAPI(superPnr,self.savePaxDetails).then(function (response) {
                        self.$router.push({name:'ReviewTravellersView'})
                    }).catch(function (e) {
                        self.snackbar = true
                        self.snackBarText = e.response.data.responseInfo.errors.substring(0, 50)
                        self.showTravellerAPIError = e.response.data.responseInfo.errors
                        self.isAPICompleted = false
                    })
                }).catch(function (error) {
                    console.log(error) 
                })
                // this.savePaxDetails.monumentPaxSummary[self.monumentId].adultCount = adultCount
                // this.savePaxDetails.monumentPaxSummary[self.monumentId].childCount = childCount
                // this.savePaxDetails.monumentPaxSummary[self.monumentId].paxInfo = this.savedPaxInfo 
                // this.savePaxDetails.monumentPaxSummary[self.monumentId].visitDate = self.availableDate
            },
            validateTelephone(evt,option){
                var regex = new RegExp("^[0-9]+$");
                var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                if (!regex.test(key)) {
                    event.preventDefault();
                    return false;
                }
            },     
            restrictSpecialChar(event) {
                var theEvent = event.htmlEvent || window.event;
                var regex = new RegExp("^[-_@.a-zA-Z0-9]+$");
                var key = String.fromCharCode(!theEvent.charCode ? theEvent.which : theEvent.charCode);
                if (!regex.test(key)) {
                    event.preventDefault();
                    return false;
                }           
            },  
            validateForm2(){
                return this.paxInfoData.gender != 'TITLE' &&  this.paxInfoData.name != '' && this.paxInfoData.age != 'AGE' && this.paxInfoData.countryName != 'COUNTRY' && this.paxInfoData.countryGroup != 'COUNTRY GROUP'
            }, 
            addTravellerListData(){
                this.paxInfoData.identityType = this.paxInfoData.identityType == 'IDENTITY TYPE' ? '' : this.paxInfoData.identityType
                this.paxInfoData.identityNumber = this.paxInfoData.identityType == 'IDENTITY TYPE' ? '' : this.paxInfoData.identityNumber
                this.paxInfoData.paxType = parseInt(this.paxInfoData.age) >= 15 ? 'ADULT':'CHILD'
                //this.savedPaxInfo = jQuery.extend(true, {}, this.paxInfoData);
                this.savedPaxInfo.push(jQuery.extend(true, {}, this.paxInfoData))
                this.selectedGender = 'MALE'
                this.paxInfoData = {
                    'countryGroup':'COUNTRY GROUP',
                    'countryName':'COUNTRY',
                    'gender' :'TITLE',
                    'age':'AGE',
                    'paxType':'',
                    'name':'',
                    'identityType':'IDENTITY TYPE',
                    'identityNumber':''  
                }
            }, 
            addTravellerList() {
                this.submittedTab2 = true   
                if(this.validateForm2()) {  
                this.submittedTab2 = false  
                this.addTravellerListData() 
                } 
            }
        },
        data () {
            return {
                monumentId:'',
                superPnr:'',
                availableDate:'',
                savedPaxInfo:[],
                submittedForm1:false,
                openSaveList:false,
                isAPICompleted:false,
                timeout: 1000,
                y: 'bottom',
                snackbar: false,
                snackBarText: '',
                traveller :{
                  email_id :'',
                  telephone_no :''
                },
                savePaxDetails :{},
                submittedTab2:false,
                paxInfoData : {
                    'countryGroup':'COUNTRY GROUP',
                    'countryName':'COUNTRY',
                    'gender' :'TITLE',
                    'age':'AGE',
                    'paxType':'',
                    'name':'',
                    'identityType':'IDENTITY TYPE',
                    'identityNumber':''
                },
                e1: null,
                cg: null,
                name:null,
                openOptionView: false,
                select:null,
                masterData: {},
                monumentListData: {},
                items: [],
                titleData: [
                    { text: 'Mr' },
                    { text: 'Mrs' },
                    { text: 'Ms' }               
                ],
                ageData: [
                    { text: '0' },
                    { text: '1' },
                    { text: '2' },
                    { text: '3' },
                    { text: '4' },
                    { text: '5' },
                    { text: '6' },
                    { text: '7' },
                    { text: '8' },
                    { text: '9' },
                    { text: '10' },
                    { text: '11' },
                    { text: '12' },
                    { text: '13' },
                    { text: '14' },
                    { text: '15' },
                    { text: '16' },
                    { text: '17' },
                    { text: '18' },
                    { text: '19' },
                    { text: '20' },
                    { text: '21' },
                    { text: '22' },
                    { text: '23' },
                    { text: '24' },
                    { text: '25' },
                    { text: '26' },
                    { text: '27' },
                    { text: '28' },
                    { text: '29' },
                    { text: '30' },
                    { text: '31' },
                    { text: '32' },
                    { text: '33' },
                    { text: '34' },
                    { text: '35' },
                    { text: '36' },
                    { text: '37' },
                    { text: '38' },
                    { text: '39' },
                    { text: '40' },
                    { text: '41' },
                    { text: '42' },
                    { text: '43' },
                    { text: '44' },
                    { text: '45' },
                    { text: '46' },
                    { text: '47' },
                    { text: '48' },
                    { text: '49' },
                    { text: '50' },
                    { text: '51' },
                    { text: '52' },
                    { text: '53' },
                    { text: '54' },
                    { text: '55' },
                    { text: '56' },
                    { text: '57' },
                    { text: '58' },
                    { text: '59' },
                    { text: '60' },
                    { text: '61' },
                    { text: '62' },
                    { text: '63' },
                    { text: '64' },
                    { text: '65' },
                    { text: '66' },
                    { text: '67' },
                    { text: '68' },
                    { text: '69' },
                    { text: '70' },
                    { text: '71' },
                    { text: '72' },
                    { text: '73' },
                    { text: '74' },
                    { text: '75' },
                    { text: '76' },
                    { text: '77' },
                    { text: '78' },
                    { text: '79' },
                    { text: '80' },
                    { text: '81' },
                    { text: '82' },
                    { text: '83' },
                    { text: '84' },
                    { text: '85' },
                    { text: '86' },
                    { text: '87' },
                    { text: '88' },
                    { text: '89' },
                    { text: '90' },
                    { text: '91' },
                    { text: '92' },
                    { text: '93' },
                    { text: '94' },
                    { text: '95' },
                    { text: '96' },
                    { text: '97' },
                    { text: '98' },
                    { text: '99' },
                    { text: '100' }
                ],
                states: [

                ]
            }
        }
    }
</script>
<style scoped="true">
	.m0 {
		margin-left: 0 !important;
	}
	.container {
		padding: 0;
	}
	.input-group {
		border-bottom: 1px solid #E0E0E0;
		margin-top: 15px;
	}
	.option {
		margin-top: 30px;
	}
    .highlighter {
        color: rgb(14, 8, 9);
    }
	.red-trans {
		width: 100%;
		background: transparent !important;
		color: #EA2330;
		border: 1px solid #EA2330;
		margin: 20px 0;
		box-shadow: none;
	}
	.contact-d .input-group {
		margin-top: 0;
	}
	.dialog__container {
		margin-right: 0 !important;
	}
	.primary--text {
		color: #1976d2 !important;
	}
	.error-message {
		font-size: 12px;
		color: #EA2330;
	}
	.list {
		padding: 10px;
	}
	.del-pax,.no-of-saved-pax,.highlighter {
		color: #EA2330;
	}
    .edit-pax{
        color: #FFBF00;
    }
    .no-of-saved-pax {
        display: inline-block;
    }
</style>

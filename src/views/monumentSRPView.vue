<template>
  <v-app name="monument-srp" >
    <v-toolbar class="monument-header">
      <v-layout row wrap>
		    <v-flex xs1 class="header_arrow_back">
          <a href="https://www.yatra.com/pwa/home.html"><v-icon class="lh45">arrow_back</v-icon></a>
        </v-flex>
     	  <v-flex xs7 class="lh15 monuCount fs16">
     	  	<v-layout row wrap>
     	      <v-flex xs12 fs14>Showing {{monumentObject[active].length == 0 ? '' : monumentObject[active].length}} monuments </v-flex>
     	      <v-flex xs12>{{currentState != '' ? currentState : (active == 'ALL'? 'INDIA': active)}}</v-flex>
			    </v-layout>
        </v-flex>
        <v-flex xs2>
            <div @click="navigateToLogin()"
            v-bind:class="{ disabled: !openListView }"
            v-if="cartLength == -1"
            class="prel count-cart">
              <span class="cart-count">!</span>
              <img src="../assets/images/cart_icon.png">
          </div>
            
        	<div @click="isLoggedIn ? openCartBlock() : navigateToLogin()"
            v-bind:class="{ disabled: !openListView }"
            v-if="cartLength >= 0"
            class="prel count-cart">
              <span v-if="cartLength >= 0" class="cart-count">{{cartLength}}</span>
              <img src="../assets/images/cart_icon.png">
          </div>
        </v-flex>
        <v-flex xs1 class="search-icon prel">
          <v-icon @click="navigateToSearch()">search</v-icon>
        </v-flex>
      </v-layout>
    </v-toolbar>
      <v-tabs v-model="activeMap" v-if="!openListView" @click="getTabItem()" style="padding-bottom: 0px">
      <v-tabs-bar class="b-333" dark>
        <v-tabs-item
          v-for="tab in tabsMap"
          :key="tab"
          :href="'#' + tab"
          ripple
        >
          {{tab}}
        </v-tabs-item>
        <v-tabs-slider color="red"></v-tabs-slider>
      </v-tabs-bar>
      </v-tabs>      
          
    <v-tabs v-model="active" v-bind:style="openListView ? showMaps : hideMaps">
      <v-tabs-bar class="b-333" dark>
        <v-tabs-item
          v-for="tab in tabs"
          :key="tab"
          :href="'#' + tab"
          ripple
        >
          {{tab}}
        </v-tabs-item>
        <v-tabs-slider color="red"></v-tabs-slider>
      </v-tabs-bar>
      <v-tabs-items class="">
        <v-tabs-content
          v-for="tab in tabs"
          :key="tab"
          :id="tab"
        >
          <v-layout row wrap 
              v-for="(monument,index) in monumentObject[tab]" 
              :key="index" v-if="monumentObject[tab].length > 0"
              @click="navigateToDetails(monument.shortTitle,monument.monumentId,monument.title,monument.shortTitle)" class="srp-result">
            <v-flex xs6 class="m-image">
              <img :src="monument.imageUrl" class="img-resp">
            </v-flex>
            <v-flex xs5 class="ml16 prel">
              <p class="monument-title" v-html="convertIntoHTML(monument.shortTitle)"></p>
              <small class="c-grey">{{monument.cityName || ""}}</small>
              <div class="price-info" v-if="monument.priceInfo">
                &#8377{{$store.getters.getTouristTypeFilter == '' ?  monument.priceInfo['INDIAN'] : monument.priceInfo[$store.getters.getTouristTypeFilter] }}
                <small> per adult</small>
              </div>
              <div class="price-info" v-if="!(monument.priceInfo)">
                &#8377
                <span>0 Free Entry</span> 
              </div>
            </v-flex>
          </v-layout>
          <v-layout row wrap v-if="monumentObject[tab].length == 0" class="no-result"> No results for this section </v-layout>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
    <v-layout row wrap v-bind:style="!openListView ? showMaps : hideMaps">
      <v-flex xs12>
        <div class="home-list-map">
          <div id="pwa-monument-map"></div> 
        </div>
      </v-flex>
    </v-layout>
    <div @click="openFilterData()" 
      class="filter-box">
        <i class="fliter-ico"></i>
    </div>
    <div class="filter">
      <div @click="openListView = true;" class="">List View</div>
      <div @click="openListView = false; monumentMapsInitialization()" class="">Map View</div>
    </div>
    <div class="ajax-loader" v-if="showLoader">
          <div class="sk-wave">
            <div class="sk-rect sk-rect1"></div>
            <div class="sk-rect sk-rect2"></div>
            <div class="sk-rect sk-rect3"></div>
            <div class="sk-rect sk-rect4"></div>
            <div class="sk-rect sk-rect5"></div>
          </div>
    </div>
    <v-snackbar :timeout="timeout" :bottom=" y === 'bottom'" :multi-line="true" v-model="snackbar">
      Loading {{active}} monuments ...
      <v-btn flat class="txt-ff close-snack" @click.native="snackbar === false">Close</v-btn>
    </v-snackbar>
      <v-snackbar :timeout="timeout" :bottom=" y === 'bottom'" :multi-line="true" v-model="snackbarMap">
      Loading {{activeMap}} monuments ...
      <v-btn flat class="txt-ff close-snack" @click.native="snackbarMap === false">Close</v-btn>
    </v-snackbar>
    <v-snackbar :timeout="timeout" :bottom=" y === 'bottom'" :multi-line="true" v-model="snackbarInfo">
      {{snackbarInfoMsg}}
      <v-btn flat class="txt-ff close-snack" @click.native="snackbarInfo === false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>
<script>
import {
  fetchMasterDataAPI,
  fetchMonumentListDataAPI,
  getCompleteMonumentListData,
  getMasterDataFromJSON,
  getMonumentListDataFromJSON,
  checkUserProfile,
  retrieveCartAPI,
  saveMonumentToCartAPI,
  getCartItems
} from "../api/api";
import { initializeGoogleMaps } from "../helper/pwaMonumentMap";
import { URLKEY } from "../util/constants";
import { adobeAnalyticsPageView } from '../helper/adobeAnalytic'
import axios from "axios";
export default {
  name: "monument-srp",
  data() {
    return {
      masterData: {},
      showMaps: {
        display: "block"
      },
      hideMaps: {
        display: "none"
      },
      timeout: 1500,
      y: "bottom",
      snackbar: false,
      snackbarMap:false,
      snackbarInfoMsg: "",
      snackbarInfo: false,
      openListView: true,
      monumentListData: {},
      tabs: ["ALL", "EAST", "WEST", "NORTH", "SOUTH", "CENTRAL"],
      tabsMap: ["ALL", "EAST", "WEST", "NORTH", "SOUTH", "CENTRAL"],    
      active: "ALL",
      activeMap:"ALL",    
      cartLength: 0,
      showLoader: true,
      itemCount: 0,
      cartId: "",
      isLoggedIn: false,
      userName: "",
      userMobile: "",
      userName: "",
      cartDataId: [],
      getItemLoader: false,
      currentState: this.$store.getters.getStateFilter,
      monumentObject: {
        NORTH: [],
        SOUTH: [],
        EAST: [],
        WEST: [],
        CENTRAL: [],
        ALL: []
      },
      monumentObjectMap: {
        NORTH: [],
        SOUTH: [],
        EAST: [],
        WEST: [],
        CENTRAL: [],
        ALL: []
      }, 
      monumentObjectOriginal: {
        NORTH: [],
        SOUTH: [],
        EAST: [],
        WEST: [],
        CENTRAL: [],
        ALL: []
      }    
    };
  },
  watch: {
    openListView(){
        if(this.openListView){
            this.active = this.activeMap
        }
    },
    active() {
      if (this.$store.getters.getStateFilter.length > 0) {
        this.$store.commit("setStateFilter", "");
        this.currentState = this.$store.getters.getStateFilter;
        this.monumentObject = {
          NORTH: [],
          SOUTH: [],
          EAST: [],
          WEST: [],
          CENTRAL: [],
          ALL: []
        };
        this.mappingData(
          this,
          this.monumentListData.monumentsList,
          this.monumentObject
        );
          this.monumentObjectMap = this.monumentObject
        this.snackbar = true;
      }
        else{
        this.$store.commit("setStateFilter", "");
        this.currentState = this.$store.getters.getStateFilter;
        this.monumentObject = {
          NORTH: [],
          SOUTH: [],
          EAST: [],
          WEST: [],
          CENTRAL: [],
          ALL: []
        };
        this.mappingData(
          this,
          this.monumentListData.monumentsList,
          this.monumentObject
        );
        }
    },
      activeMap() {
//      if (this.$store.getters.getStateFilter.length > 0) {
//        this.$store.commit("setStateFilter", "");
//        this.currentState = this.$store.getters.getStateFilter;
//        this.monumentObjectMap = {
//          NORTH: [],
//          SOUTH: [],
//          EAST: [],
//          WEST: [],
//          CENTRAL: [],
//          ALL: []
//        };
//        this.mappingData(
//          this,
//          this.monumentListData.monumentsList,
//          this.monumentObjectMap
//        );
//        this.snackbar = true;
//      }
        if (this.$store.getters.getStateFilter.length > 0) {
            this.snackbarMap = true
        }
          
        this.$store.commit("setStateFilter", "");
        this.currentState = this.$store.getters.getStateFilter;
            this.monumentObjectMap = {
          NORTH: [],
          SOUTH: [],
          EAST: [],
          WEST: [],
          CENTRAL: [],
          ALL: []
        };
        this.mappingData(
          this,
          this.monumentListData.monumentsList,
          this.monumentObjectMap
        );
        initializeGoogleMaps(this.monumentObjectMap[this.activeMap]);   
    }
  },
  mounted() {
    let self = this;
    self.showLoader = true;
   // if(localStorage.getItem('filterNavigation') == 'undefined' || localStorage.getItem('filterNavigation') == undefined) 
     //   {
       //     this.openListView = true
        //}
      //else{
        //  this.openListView = JSON.parse(localStorage.getItem('filterNavigation'))
      //}
    
    // Removing add to cart code
    //let exitMonument = this.$store.getters.getExitMonument

    // Remove KEY & ADOBE code
    // var key = localStorage.getItem('key');
    // if(key == URLKEY){
    //    do nothing
    // }
      
     adobeAnalyticsPageView("yt:monument:dom:srp:all","monuments","business","monument srp","domestic monument","all")

    self.checkUser();
    self.monumentObjectMap =  self.monumentObject 
    self.activeMap="ALL"  
  },
  methods: {
    checkUser() {
      var self = this;
      //check whether user is logged in or not
      let userLoginParams = {
        includeOptionalParams: true,
        channel: "B2C",
        productId: "yatrapwamonuments"
      };
      checkUserProfile(userLoginParams)
        .then(function(userInfo) {
          if (userInfo.data.status == "FAIL") {
            // just show monument data
            self.getMasterData();
            self.getMonumentData();
            // self.isLoggedIn = true;
            // self.retrieveCart(null, 'countOnly')
            console.log(userInfo.data.status, "Check User");
          } else {
            self.isLoggedIn = true;
            self.userEmail = userInfo.data.responseData.userInfo.email;
            self.userMobile = userInfo.data.responseData.userInfo.mobile;
            self.userName =
              userInfo.data.responseData.userInfo.name +
              " " +
              userInfo.data.responseData.userInfo.lastName;
            // saving data in local storage
            localStorage.setItem("isLoggedIn", self.isLoggedIn);
            localStorage.setItem("userEmail", self.userEmail);
            localStorage.setItem("userMobile", self.userMobile);
            localStorage.setItem("userName", self.userName);
            self.$store.commit(
              "setUserInfoData",
              userInfo.data.responseData.userInfo
            );
            // making cart api call to fetch data
            if (self.isLoggedIn) {
              self.getMasterData();
              self.getMonumentData();
              self.retrieveCart();
            }
          }
        })
        .catch(function(error) {
          console.log(error,"Something wrong with checkApi request");
        });
    },
    navigateToLogin(){
        this.$store.commit('setAppFlow', 'cartflow')
        this.$router.push({name:'LoginView'})
    },
    getMasterData() {
      let self = this;
      let providedMasterData = self.$store.getters.getMasterData
      let providedMasterDataLen = Object.keys(providedMasterData).length
      if( providedMasterDataLen > 0 ) {
        self.masterData = providedMasterData
      } else {
        getMasterDataFromJSON().then(
          response => {
            self.masterData = response.data.data;
            if (self.masterData) {
              self.$store.commit("setMasterData", self.masterData);
            } else {
              self.getMasterDataAPI();
            }
          },
          error => {}
        );
      }
    },
    getMonumentData() {
      let self = this;
      // getMonumentListDataFromJSON().then(
      //   response => {
      //     self.monumentListData = response.data.data;
      //     if (
      //       self.monumentListData &
      //       (self.monumentListData.totalMonuments > 1)
      //     ) {
      //       self.$store.commit(
      //         "setMonumentListData",
      //         self.monumentListData.monumentsList
      //       );
      //     } else {
      //       self.getMonumentListDataAPI();
      //     }
      //   },
      //   error => {
      //     console.log("err..", "Failed to fetch monuments details");
      //   }
      // );
      self.getMonumentListDataAPI();
    },
    // secureLogin() {
    //   var sso_login_url = `${SSO_LOGIN_URL}`,
    //     returned_url = window.location.href;
    //   try {
    //     var x = document.getElementById("app");
    //     var form = document.createElement("form");
    //     form.setAttribute("method", "post");
    //     form.setAttribute("action", sso_login_url);

    //     var hiddenField = document.createElement("input");
    //     hiddenField.setAttribute("type", "hidden");
    //     hiddenField.setAttribute("name", "returnUrl");
    //     hiddenField.setAttribute("value", returned_url);
    //     form.appendChild(hiddenField);
    //     x.appendChild(form);
    //     form.submit();
    //   } catch(err) {
    //     console.log(err.message);
    //   }
    // },
    retrieveCart() {
      var self = this;
      retrieveCartAPI()
        .then(response => {
          self.cartId = response.data.cartId;
          self.itemCount = response.data.itemCount;
          self.cartLength = self.itemCount;
          localStorage.setItem("cartId", self.cartId);
          localStorage.setItem("itemCount", self.itemCount);
          if(!self.cartId || self.cartId == 'undefined') {
              self.cartLength = -1
          }
          // if(exitMonument) {
          //   self.savingMonument(self.cartId)
          // } else {
          //   self.getCartItemsCall(self.cartId)
          // }
          // if(countOnly == 'countOnly') {
          //   self.fetchingCartCount(self.cartId)
          // }
        })
        .catch(error => {
          console.log(error, "Issue with retrieve cart API");
        });
    },
    // fetchMonumentFromId(list, id) {
    //   return (list.filter(function(el, index){
    //     return (el.monumentId == id)
    //   }))
    // },
    // fetchingCartCount(cartId) {
    //   cartItemCount(cartId).then(response => {
    //     this.cartLength = response.count
    //   })
    // },
    // getCartItemsCall(cartId) {
    //   var self = this
    //   if(cartId) {
    //     getCartItems(cartId).then(response => {
    //       self.cartDataId = response.data.itemList
    //       self.getItemLoader = true
    //       // disabling add to cart button
    //       self.cartDataId.map(function(item, index) {
    //         var monument = self.fetchMonumentFromId(self.monumentListData.monumentsList, item.productId)
    //          self.$set(monument[0], "isActive", true);
    //       })
    //     }).catch(error => {
    //       console.log(error, "cart can't be fecthed")
    //     })
    //   }
    //   else {
    //     console.log('There has been some issue with cart ID')
    //   }
    // },
    convertIntoHTML(txt) {
      var t = new DOMParser().parseFromString(txt, "text/html").body;
      return t.innerText;
    },
    monumentMapsInitialization() {
        this.activeMap = this.active
        if(this.active == 'ALL'){
            if (this.$store.getters.getStateFilter.length > 0) {
                initializeGoogleMaps(this.monumentObjectMap["ALL"]);
            }
            else{
                initializeGoogleMaps(this.monumentListData.monumentsList);
            }  
        }
        
        else{
            if (this.$store.getters.getStateFilter.length > 0) {
                initializeGoogleMaps(this.monumentObjectMap["ALL"]);
            }
            else{
                initializeGoogleMaps(this.monumentObjectMap[this.activeMap]);
            }
        }
     
    },
    navigateToSearch() {
      this.$router.push({ name: "MonumentsSearchView" });
    },
    navigateToDetails(name, id, title, shorttitle) {
      localStorage.setItem("monument_Id", id);
      localStorage.setItem("monument_title", title);
      localStorage.setItem("monument_shorttitle", shorttitle);
      this.$router.push({
        path: "/pwa/monuments/details",
        query: { monumentId: id }
      });
    },
    saveMasterData() {
      saveMasterDataToJSON(this.masterData).then(response => {}, error => {});
    },
    saveMonumentListData() {
      saveMonumentListDataFromJSON(this.monumentListData).then(
        response => {},
        error => {}
      );
    },
    openFilterData() {
      localStorage.setItem('filterNavigation',this.openListView)    
      this.$router.push({ name: "FilterView" });
    },
    openCartBlock() {
      this.$store.commit("setCartBackRoute", "srp");
      this.$router.push({ name: "CartBlock" });
    },
    mappingData(self, Arr, Obj) {
      Arr.map(function(val, index) {
        if (
          val.region &&
          (self.$store.getters.getStateFilter.length == 0 ||
            self.$store.getters.getStateFilter.includes(val.stateName))
        ) {
          Obj[val.region].push(val);
        }
        if (
          self.$store.getters.getStateFilter.length == 0 ||
          self.$store.getters.getStateFilter.includes(val.stateName)
        ) {
          Obj["ALL"].push(val);
        }
      });
    },
    getMasterDataAPI() {
      let self = this;
      axios
        .all([fetchMasterDataAPI(), fetchMonumentListDataAPI()])
        .then(
          axios.spread(function(masterData, monumentData) {
            self.masterData = masterData.data.data;
            self.monumentListData = monumentData.data.data;
            //self.saveMasterData()
            self.$store.commit("setMasterData", masterData.data.data);
          })
        )
        .catch(function(error) {});
    },
    getMonumentListDataAPI() {
      let self = this;
      let providedData = self.$store.getters.getMonumentListData
      let providedLen = Object.keys(providedData).length
      if(providedLen > 0) {
        self.monumentListData = providedData;
        self.mappingData(
          self,
          providedData.monumentsList,
          self.monumentObject
        );
        self.showLoader = false;
      } else {
        getCompleteMonumentListData().then(
          response => {
            self.monumentListData = response.data.data;
            self.$store.commit("setMonumentListData", response.data.data);
            self.mappingData(
              self,
              self.monumentListData.monumentsList,
              self.monumentObject
            );
            self.showLoader = false;
          },
          error => {}
        );
      }
    }
    // addItem (monument){
    //   // add item to cart code
    //   var self = this
    //   if(!self.isLoggedIn) {
    //     this.$store.commit('setExitMonument', monument)
    //     this.$store.commit('setAppFlow', 'cartflow')
    //     this.$router.push({name:'LoginView'})
    //   } else {
    //     self.savingMonument(monument, self.cartId)
    //   }
    // },
    // savingMonument (monument, cartId){
    //   let self = this
    //   var checkMonumentInCart = false
    //   self.cartDataId.map(function(item, index) {
    //     if(item.productId == monuments.monumentId) {
    //       checkMonumentInCart = true
    //       console.log("item already in cart")
    //     }
    //   })
    //   if(!checkMonumentInCart) {
    //     let items = [{
    //       itemId : "",
    //       productId : monuments.monumentId,
    //       title : monuments.shortTitle,
    //       "fromTime": "",
    //       "toTime": "",
    //       "imageUrl": "",
    //       "quantity": 1,
    //       "product": "Monuments"
    //     }]
    //     saveMonumentToCartAPI(items, cartId).then(response => {
    //       self.$store.commit('setExitMonument', {})
    //     }).catch(function(error){

    //     })
    //   } else {
    //     self.snackbarInfo = true
    //     self.snackbarInfoMsg = monuments.shortTitle + ' is already in cart.'
    //   }
    // }
  }
};
</script>
<style scoped lang="stylus">
.b-333 {
  background-color: #333;
}

.m-image {
  width: 50%;

  img {
    border-radius: 5px;
    min-height: 100px;
    background: url('../assets/images/left-tupple.gif') no-repeat center;
  }
}

.ml16 {
  margin-left: 16px;
}

p {
  margin-bottom: 0;
  line-height: 20px;
}

.tuple {
  border-bottom: 1px solid #eee;
  background-color: #fff;
  padding: 16px !important;

  .c-grey {
    color: #9C9798;
    position: relative;
    top: -5px;
  }

  .price-info {
    bottom: 4px;
    color: #1976d2;
  }
}

.monuCount {
  align-items: center;
  justify-content: center;
  display: flex;
}

.monument-header {
  .layout {
    margin: 0 !important;
  }
}

.search-icon {
  i {
    position: absolute;
    right: -20px;
    font-size: 28px;
    top: 12px;
  }
}

.home-list-map {
  height: 590px;
  width: 100%;

  #pwa-monument-map {
    width: 100%;
    height: 100%;
  }
}

.filter {
  position: fixed;
  bottom: 0;
  background: #fff;
  width: 100%;
  display: flex;

  div {
    width: 50%;
    text-align: center;
    background: #ea2330;
    color: #fff;
    padding: 10px;
    border-right: 1px solid #fff;

    &.filter-box {
      width: 100%;
      border-bottom: 1px solid #fff;
    }

    &:last-child {
      border-right: none;
    }
  }
}

.tabs {
  padding-bottom: 50px;
}

.filter-box, .cart-block {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background: #ea2330;
  position: fixed;
  bottom: 55px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);

  &.disabled {
    cursor: no-drop;
    pointer-events: none;
    background: #ccc;
  }
}

.cart-block {
  bottom: auto;
  background: transparent;
  top: 110px;
  right: 5px;
  width: 60px;
  height: 60px;
}

.cart-count {
  color: #fff;
  position: absolute;
  left: -2px;
  top: -2px;
  background-color: #ea2330;
  border-radius: 50%;
  height: 18px;
  width: 18px;
  text-align: center;
  font-size: 12px;
}

.fliter-ico {
  background: url('../assets/images/filter-ico.png') no-repeat;
  height: 24px;
  width: 24px;
  display: inline-block;
}

.cart-ico, .loading-cart {
  background: url('../assets/images/cart_icon.png') no-repeat center;
  height: 24px;
  width: 24px;
  display: inline-block;
}

.loading-cart {
  background: url('../assets/images/left-tupple.gif') no-repeat center;
}

.ajax-loader {
  position: fixed;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 5px;
  line-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  min-height: 200px;
  top: 0px;
  z-index: 9999;
}

.lh45 {
  line-height: 45px;
}

.srp-result:first-child {
  padding-top: 20px;
}

.srp-result {
  padding: 15px 20px 0px 20px;
}

.no-result {
  width: 100%;
  justify-content: center;
  padding: 20px;
  padding-top: 85px;
}

.price-info {
  color: #2788e6;
}

.close-snack {
  color: #EA2330;
}

.fs15 {
  font-size: 15px;
}

.add-monument {
  background-color: #2788e6 !important;
  text-align: center;
  color: #fff !important;
  margin: 0 !important;

  &.disabled {
    cursor: no-drop;
    pointer-events: none;
    background: #ccc !important;
  }
}

.monument-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.count-cart {
  position: relative;
  left: 32px;
  top: 13px;
}
</style>

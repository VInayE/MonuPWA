<template>
  <v-app name="filter-srp" >
    <div class="row header" @click="navigateToSrp()">
      <div class="layout">
        <div class="flex header_arrow_back xs1"><i aria-hidden="true" class="material-icons icon">arrow_back</i>
      </div>
      <div class="xs3 fs20">Filter</div>
      </div>
    </div>
    <v-layout row wrap class="wrapper-inner">
        <v-flex xs4 class="left-filter">
          <v-layout row wrap @click="stateFilter = true; touristFilter = false" v-bind:class="{ opened: stateFilter }" class="filter-tab">
            State
            <i class="material-icons icon check_circle tick-icon-1" v-if="this.ex1.length > 0">check_circle</i>
          </v-layout>
          <v-layout row wrap @click="touristFilter = true; stateFilter = false;" v-bind:class="{ opened: touristFilter }" class="filter-tab">
            Tourist Type
            <i class="material-icons icon check_circle tick-icon-1" v-if="this.ex8.length > 0">check_circle</i>
          </v-layout>
        </v-flex>
     	<v-flex xs8 class="right-fliter">
           <v-layout row wrap v-if="stateFilter" class="state-section">
             <v-container fluid>
                <v-layout row wrap >
                    <v-flex xs12 md6>
                        <v-subheader>State</v-subheader>
                        <v-card flat>
                        <v-card-text>
                          <v-radio-group v-model="ex1" :mandatory="false">
                            <v-radio v-for="(states,index) in touristType" :label="states" :value="states" :key="index"></v-radio>
                          </v-radio-group>
                        </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
             </v-container>
            </v-layout>
           <v-layout row wrap v-if="touristFilter">
             <v-container fluid>
                <v-layout row wrap >
                    <v-flex xs12 md6>
                        <v-subheader>State</v-subheader>
                        <v-card flat>
                        <v-card-text>
                            <v-radio-group v-model="ex8" :mandatory="false">
                                <v-radio v-for="(tourist,index) in $store.getters.getMasterData.visitors" :label="index" :value="index" :key="index"></v-radio>
                           </v-radio-group>
                        </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
             </v-container>
           </v-layout>
        </v-flex>
    </v-layout>
     <div class="btn-group">
        <div class="row reset-btn" 
          v-bind:class="{ disabled: this.ex1.length <= 0 && this.ex8.length <= 0 }" @click="resetFilteredData()">Reset
        </div>
        <div class="row apply-btn" 
          @click="submitFilteredData()">Apply
        </div> 
     </div>
    <v-snackbar :timeout="timeout" :bottom=" y === 'bottom'" :multi-line="true" v-model="snackbar">
      Filters resetting done ...
      <v-btn flat class="txt-ff close-snack" @click.native="snackbar === false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>
<script>
  import {fetchMasterDataAPI,fetchMonumentListDataAPI,getCompleteMonumentListData,getMasterDataFromJSON,saveMonumentListDataFromJSON,getMonumentListDataFromJSON} from '../api/api'
  import axios from 'axios'
  export default {
    data (){
      return {
         stateFilter:true,
         touristFilter:false,
         ex1: this.$store.getters.getStateFilter,
         ex8: this.$store.getters.getTouristTypeFilter,
         ex2: false,
         ex3: true,
         ex4: false,
         timeout: 1000,
         y: 'bottom',
         snackbar: false,
         touristType:[]
      }  
    },
    mounted (){
      if(Object.keys(this.$store.getters.getMasterData).length == 0){
           this.$router.push({name:'MonumentSRPView'})
      }else {
        this.touristType = this.$store.getters.getMasterData.states
      }      
    },
    methods:{
      navigateToSrp(){
          this.$router.push({name:'MonumentSRPView'})
      }, 
      submitFilteredData(){
          this.$store.commit('setStateFilter',this.ex1) 
          this.$store.commit('setTouristTypeFilter',this.ex8) 
          this.$router.push({name:'MonumentSRPView'})
      },
      resetFilteredData(){
        this.snackbar = true
        this.ex1 = "";
        this.ex8 = "";
        this.$store.commit('setStateFilter',this.ex1) 
        this.$store.commit('setTouristTypeFilter',this.ex8) 
      }
    }
  }
</script>
<style type="text/css">
  .header{
    padding: 0 16px;
    box-shadow: 0 0 10px rgba(0,0,0,.24);
	height: 56px;
    line-height: 56px;
  }
  .wrapper-inner{
    padding-bottom: 46px;
  }
  .btn-group{
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 1;
  }
  .apply-btn{    
    background: #ea2330;
    color: #fff;
    width: 50%;
    padding: 10px;
    text-align: center;
    float: left;
  }
  .reset-btn{
    background: #ea2330;
    color: #fff;
    width: 50%;
    padding: 10px;
    text-align: center;
    float: left;
    border-right: 1px solid #ccc;
  }
  .reset-btn.disabled {
    cursor: no-drop;
    pointer-events: none;
    background: #ccc;
  }
  .state-section{
    padding: 0;
  }
  .card__text{
    padding: 0;
  }
  .left-filter{
    background-color: #f5f5f5;
    color: #9e9e9e;
    margin-top: 5px;
  }
  .container{
    padding: 5px;
  }
	.container .card {
		padding: 10px;
	}
  .subheader{
    display: none;
  }
  .filter-tab{
    height: 80px;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .card__text > .input-group{
    padding: 0;
  }
  .tick-icon-1{
    font-size: 12px;
    color: #eb2330 !important;
    position: absolute;
    top: 5px;
    right: 7px;
    z-index: 9999;
  }
  .opened{
    background: #ccc;
	  color: #fff;
  }
</style>

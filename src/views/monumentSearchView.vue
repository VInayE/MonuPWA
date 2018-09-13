<template>
  <v-app class="monuments-srp-search">
  <div class="flex-item p16">
  	<v-layout row wrap class="search-header">
  		<v-flex xs1 class="header_arrow_back">
           <v-icon @click="navigateToSrp()">arrow_back</v-icon>
         </v-flex>
         <v-flex xs10>
         	<input type="text" placeholder="Search monument, city, state" v-model="searchParam">
         </v-flex>
  	</v-layout>
	</div>
	<div v-if="searchParam.length < 2" class="p15">
		<ul class="d-iblock search-tabs">
			<li><a @click="activeTab = 'north' " v-bind:class="{ active: activeTab == 'north' , nonactive: activeTab != 'north' }">NORTH</a></li>
			<li><a @click="activeTab = 'east' " v-bind:class="{ active: activeTab == 'east' , nonactive: activeTab != 'east' }">EAST</a></li>
			<li><a @click="activeTab = 'west' " v-bind:class="{ active: activeTab == 'west' , nonactive: activeTab != 'west' }">WEST</a></li>
			<li><a @click="activeTab = 'south' " v-bind:class="{ active: activeTab == 'south' , nonactive: activeTab != 'south' }">SOUTH</a></li>
		</ul>
		<ul class="d-iblock search-img">
			<li v-for="(searchData,k) in listSearchData" @click="navigateToDetails(searchData.name, searchData.id)" style="cursor:pointer;" :key="k" class="prel">
				<img :src="searchData.imageUrl" style="cursor:pointer" class="img-resp" >
				<p class="pabs">{{searchData.name}}</p>
			</li>
		</ul>
	</div>
 	<div class="p16">
  	<v-layout row wrap class="search-body"	  	
	  	v-if="searchParam.length > 2 && Object.keys(autosuggestData).length > 0  && (autosuggestData.states.length > 0 || autosuggestData.cities.length >0 || autosuggestData.monuments.length >0)">
  		<v-flex xs12 v-for="(state,index) in autosuggestData.states" :key="index"
		@click.prevent="navigateToList('state',state,$event)">
  			 <i class="ico-sprite ico-state a"></i>
                   <span v-html="searchTextHighlight(searchParam,state.name)"></span>
  		</v-flex>
  		<v-flex xs12 v-for="(city,index) in autosuggestData.cities" :key="index"
		@click.prevent="navigateToList('city',city,$event)">
  			 <i class="ico-sprite ico-state b"></i>
                   <span v-html="searchTextHighlight(searchParam,city.name)"></span>
  		</v-flex>
  		<v-flex xs12 v-for="(monument,index) in autosuggestData.monuments" :key="index" @click='navigateToDetails(monument.name, monument.id)'>
  			 <i class="ico-sprite ico-monuments c"></i>
                   <span v-html="searchTextHighlight(searchParam,monument.name)"></span>
  		</v-flex>		
  	</v-layout>
	  <v-layout row wrap>
		<v-flex v-if="searchParam.length > 2 && (autosuggestData.cities && autosuggestData.states && autosuggestData.monuments && autosuggestData.cities.length == 0 && autosuggestData.states.length == 0 && autosuggestData.monuments.length == 0)" class="no-result">
			<img src="" class="img-nofound">
            <h2 class="resp-h2">No Result(s) Match for {{searchParam}}</h2>
            <p class="resp-p">Please change the state and select any region !</p>
        </v-flex>
	  </v-layout>
	</div>
  </v-app>  
</template>
<script>
	import {fetchAutoSuggestAPI} from '../api/api'
	import {textHighlight} from '../helper/pwaMonumentsHelper'
	import axios from 'axios'
	export default {
		name : 'monuments-srp-search',
		data () {
			return {
				searchParam:'',
				autosuggestData: {},
				mostPopularTile : {
					north:[
						{'imageUrl' :'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_detailslargeimg/v1514015046/Monuments/vaishali/5e99bf4e-6b77-4799-bc9c-2ab7d76a289a/1_cnZyIT.jpg','name':'Relic Stupa','place':'Vaishali','id':'ASI_5e99bf4e-6b77-4799-bc9c-2ab7d76a289a'},
						{'imageUrl' :'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514014389/Monuments/lahaul-spiti/3c7ddc9f-f3a8-465f-bc1c-0e0ad3ce24ed/4_EKsk7m.jpg','name':'Buddhist Monastery','place':'Spiti','id':'ASI_3c7ddc9f-f3a8-465f-bc1c-0e0ad3ce24ed'},
						{'imageUrl' :'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514014261/Monuments/agra/e8948564-0040-44a5-b364-83638d3017ea/4_QTWv7G.jpg','name':'Agra Fort','place':'Agra','id':'ASI_e8948564-0040-44a5-b364-83638d3017ea'},
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514014482/Monuments/sivasagar/c7cff4f6-2c2d-47ff-b37e-96e8d3f40201/4_S4Ylem.jpg','name':'Devidol','place':'Sivasagar','id':'ASI_c7cff4f6-2c2d-47ff-b37e-96e8d3f40201'},
						{'imageUrl' :'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514015015/Monuments/jhansi/b829fa2c-4f17-4a9c-8c0f-0cf97ad4b5d1/4_ScpyAm.jpg','name':'Rani Mahal','place':'Jhansi','id':'ASI_b829fa2c-4f17-4a9c-8c0f-0cf97ad4b5d1'}, 
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514015029/Monuments/sawaimadhopur/f718b1d1-6ae1-4a67-9864-6d23e98533f2/4_pgPmWB.jpg','name':'Ranthambore Fort','place':'Ranthambore','id':'ASI_f718b1d1-6ae1-4a67-9864-6d23e98533f2'}
					],
					east:[
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514015108/Monuments/bhojpur/f6dc7358-665a-476b-82a8-ece1616f9a83/4_1XwtnP.jpg','name':'Shiva Temple','place':'Bhopal','id':'ASI_f6dc7358-665a-476b-82a8-ece1616f9a83'},
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514015242/Monuments/bhubaneswar/77a0d03a-38bf-451a-8e7b-a570fe32acbd/4_bLXkwA.jpg','name':'Udaygiri Caves','place':'Bhubaneshwar','id':'ASI_77a0d03a-38bf-451a-8e7b-a570fe32acbd'},
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514015269/Monuments/bhagalpur/94aad72a-3182-4904-a761-5a8b14696d7b/4_ieOvhq.jpg','name':'Vikramshila Monastery','place':'Bhagalpur','id':'ASI_94aad72a-3182-4904-a761-5a8b14696d7b'},     
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514014457/Monuments/bihar/f3f112f9-6e40-46fa-998d-03f3a6fb8e98/4_tCvepO.jpg','name':'Cooch Behar Palace','place':'Cooch','id':'ASI_f3f112f9-6e40-46fa-998d-03f3a6fb8e98'},
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514015145/Monuments/puri/27c9a98d-0964-499c-a065-721a4aeffe10/4_jwxACa.jpg','name':'Sun Temple','place':'Konarak','id':'ASI_27c9a98d-0964-499c-a065-721a4aeffe10'},
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514014625/Monuments/murshidabad/834f74fd-cf26-4d3d-babf-44cbf689990c/4_saY4ON.jpg','name':'Hazardauri Palace ','place':'Murshidabad','id':'ASI_834f74fd-cf26-4d3d-babf-44cbf689990c'}
					],
					south:[
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514014990/Monuments/srirangapatna/06fa5bf9-76dc-4038-b70a-ae737a4bff24/4_X0J8vV.jpg','name':'Sri Ranganatha Swami Temple','place':'Srirangapatna','id':'ASI_06fa5bf9-76dc-4038-b70a-ae737a4bff24'},
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514014939/Monuments/hassan/229b3b3b-6d1e-47d7-ad4b-52b12e082c2a/4_A5GDf5.jpg','name':'Parsvanatha Basadi','place':'Hassan','id':'ASI_229b3b3b-6d1e-47d7-ad4b-52b12e082c2a'},
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514014806/Monuments/hassan/b84fef8e-e9b8-4791-a07d-62329b43374e/4_6vCDCY.jpg','name':'Kedaresvara Temple','place':'Halebidu','id':'ASI_b84fef8e-e9b8-4791-a07d-62329b43374e'},
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514014576/Monuments/bijapur/73cb04cd-0ada-4967-816c-0764a7940966/4_hACs8c.jpg','name':'Gol Gumbaz','place':'Bijapur','id':'ASI_73cb04cd-0ada-4967-816c-0764a7940966'},
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514014818/Monuments/belurhalebedu/a1dee11f-2e2c-48bb-ab1a-0890fcd8c8d6/4_lkrVck.jpg','name':'Keshava Temple','place':'Belur','id':'ASI_a1dee11f-2e2c-48bb-ab1a-0890fcd8c8d6'},     
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514014952/Monuments/pattadakal/a4401532-d0e7-4fc8-8a83-a99bc09eb7d0/4_a01PKc.jpg','name':'Group of Monuments','place':'Pattadakal','id':'ASI_a4401532-d0e7-4fc8-8a83-a99bc09eb7d0'}
					],
					west:[
						{'imageUrl' : 'https://imgcld.yatra.com/dpv7guyco/image/upload/t_monuments_srplist/v1512395250/Monuments/chikhaldara/ASI_e5900466-645f-49a8-81bb-48ff84490364/4_HfiE0b.jpg','name':'Gawligarh Fort','place':'Chikhaldara','id':'ASI_e5900466-645f-49a8-81bb-48ff84490364'},
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514014431/Monuments/pavagadh/bf1bb545-439c-4d7a-89c5-aba0df5d8d5a/4_JHZP1E.jpg','name':'Ellora Caves','place':'Aurangabad','id':'ASI_f490c5ac-a163-4143-9046-2c50014d231e'},
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514014508/Monuments/aurangabad/f490c5ac-a163-4143-9046-2c50014d231e/4_66WAt7.jpg','name':'Champaner Archaelogical Park','place':'Gujarat','id':'ASI_bf1bb545-439c-4d7a-89c5-aba0df5d8d5a'},
						{'imageUrl' : 'https://imgcld.yatra.com/dpv7guyco/image/upload/t_monuments_srplist/v1512396266/Monuments/modhera/ASI_7b94823b-cf61-4730-97f4-4d742cc690ec/4_wqOkhf.jpg','name':'Sun Temple','place':'Gujarat','id':'ASI_7b94823b-cf61-4730-97f4-4d742cc690ec'},
						{'imageUrl' : 'https://imgcld.yatra.com/dpv7guyco/image/upload/t_monuments_srplist/v1512394689/Monuments/aurangabad/ASI_225ad77a-081f-4c16-b255-c1981407dad0/4_ScIa05.jpg','name':'Ajanta Caves','place':'Aurangabad','id':'ASI_225ad77a-081f-4c16-b255-c1981407dad0'},
						{'imageUrl' : 'https://imgcld.yatra.com/ytimages/image/upload/t_monuments_srplist/v1514015161/Monuments/modhera/7b94823b-cf61-4730-97f4-4d742cc690ec/4_DJAIIl.jpg','name':'Rani Ki Vav','place':'Ahmedabad','id':'ASI_deb1135d-375c-4066-8564-107818ae2770'}    
					]                 
				},	
     			activeTab:'north'
			}
		},
		methods :{
			 navigateToSrp ()  {
				this.$router.push({name:'MonumentSRPView'})
			 },
			 navigateToDetails (name,id) {
				localStorage.setItem('monument_title',name)
				this.$router.push({path: '/pwa/monuments/details', query: { monumentId: id }})
			 },
			 searchTextHighlight(searchText, presentValue){
            	return textHighlight(searchText, presentValue)
			 },
			 navigateToList(type,option,e) {
				if (type == 'state') {
					this.$store.commit('setStateFilter',[])
					this.$store.commit('setStateFilter',[option.name])
					this.navigateToSrp ()
				}
				if (type == 'city') {
					this.$store.commit('setStateFilter',[])
					this.$store.commit('setCityFilter',['a'])
				}
			 }
		},
		created (){
			 this.listSearchData = this.mostPopularTile.north
		},
		watch :{
			activeTab (){
			 this.listSearchData = this.mostPopularTile[this.activeTab]
			},
		 searchParam () {
				let self = this
				if(this.searchParam.length > 2) {
					fetchAutoSuggestAPI(this.searchParam).then(response => {
						self.autosuggestData = response.data.data
					}, response => {
						self.autosuggestData = {}
					});
				} else {
					this.autosuggestData = {}
				}
		  }
		}
	}
</script>
<style scoped lang="stylus">

.monuments-srp-search {
	    background: #fff !important;
	.search-body {
		.flex {
			padding: 5px 0;
			border-bottom: 1px solid #E0E0E0;
		}
		span {
			white-space: nowrap;
			overflow: hidden;
			-o-text-overflow: ellipsis;
			text-overflow: ellipsis;
			display: inline-block;
			width: 85%;
			margin-left: 10px;
			vertical-align: middle;
			font-size: 14px;
			text-transform: lowercase;
		}
	}
	input {
		width: 100%;
	}
	.search-tabs  {
		text-align: center;
		padding:20px;
		li {
			display: inline-block;
			margin-right: 15px;
			a{
				color: #666;
				font-size: 14px;
			}
			.active {
				color: #2387f5;
			}
		}
	}
	.search-img {
		li {
			display: inline-block;
			width: 47%;
			margin-right: 15px;
			&:nth-child(2n) {
				margin-right: 0;
			}
			img {
				 min-height: 120px;
   				 max-height: 120px;
			}
		}
		p {
			color: #fff;
			text-align: left;
			left: 0;
			padding: 5px 10px;
			background: rgba(0,0,0,.4);
			width: 100%;
			bottom: 6px;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			font-size: 13px;
		}
	}
	.p15 {
		padding: 0 15px;
	}
	.ico-state {
	background-position: 0 -47px;
	width: 32px;
	height: 32px;
	}
	.ico-monuments {
		background-position: 0 0;
	width: 32px;
	height: 32px;
	}
}
</style>

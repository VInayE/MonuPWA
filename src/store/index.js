import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      masterData:{},
      monumentListData:{},
      stateFilter :'',
      touristTypeFilter :'',
      cityFilter : [],
	    userInfoData :{},
	    sToken :{},
      monumentId:'',
      monumentPrice:'',
      MonumentTimings: {},
      CartItemTimings: [],
      calenderIndex:'0',
      MonumentGetTimings: new Date(new Date().setDate(new Date().getDate()+1)),
      CurrentCalIndex: 0,
      AppFlow: 'normal',
      CurrentMonument: {},
      CartBackRoute: ''
    },
    actions,
    mutations,
    getters
  })
}

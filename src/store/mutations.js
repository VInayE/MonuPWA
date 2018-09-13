import Vue from 'vue'

export default {
    setMasterData: (state,payload) => {
      state.masterData = payload
    },
    setMonumentListData : (state,payload) => {
      state.monumentListData = payload
    },
    setStateFilter : (state,payload) => {
      state.stateFilter = payload
    },
    setTouristTypeFilter : (state,payload) => {
      state.touristTypeFilter = payload
    },
	  setUserInfoData : (state,payload) => {
		  state.userInfoData = payload
    },
    setMonumentPrice : (state,payload) => {
		  state.monumentPrice = payload
	  },
	  setSToken : (state,payload) => {
		  state.sToken = payload
	  },
	  setMonumentId : (state,payload) => {
		  state.monumentId = payload
    },
    setMonumentTimings : (state,payload) => {
		  state.MonumentTimings = payload
    },
    setCartItemTimings : (state,payload) => {
		  state.CartItemTimings = payload
    },
    setCurrentCalIndex : (state,payload) => {
		  state.CurrentCalIndex = payload
    },
    setAppFlow : (state,payload) => {
		  state.AppFlow = payload
    },
    setCartBackRoute : (state,payload) => {
		  state.CartBackRoute = payload
    },
    setExitMonument : (state,payload) => {
		  state.CurrentMonument = payload
    },
    setTimings :(state,payload) => {
      state.MonumentGetTimings = payload
    },
    setCalenderIndex :(state,payload) => {
      state.calenderIndex = payload
    },
    setCityFilter : (state,payload) => {
      state.cityFilter = payload
    }
}

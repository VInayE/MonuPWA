export default {
  getMasterData: (state) => {
    return state.masterData
  },
  getMonumentListData :(state) => {
    return state.monumentListData
  },
  getStateFilter :(state) => {
    return state.stateFilter
  },
  getTouristTypeFilter :(state) => {
    return state.touristTypeFilter
  },
  getMonumentId :(state) => {
    return state.monumentId
  },
  getMonumentTimings :(state) => {
    return state.MonumentTimings
  },
  getCartItemTimings :(state) => {
    return state.CartItemTimings
  },
  getCurrentCalIndex :(state) => {
    return state.CurrentCalIndex
  },
  getTimings :(state) => {
    return state.MonumentGetTimings
  },
  getAppFlow :(state) => {
    return state.AppFlow
  },
  getCartBackRoute :(state) => {
    return state.CartBackRoute
  },
  getExitMonument :(state) => {
    return state.CurrentMonument
  },
  getCalenderIndex :(state) => {
    return state.calenderIndex
  },
  getCityFilter :(state) => {
    return state.cityFilter
  }
}

import axios from 'axios'
import {API_URL} from '../util/constants'
import {HOTEL_API_URL} from '../util/constants'
import {ACT_API_URL} from '../util/constants'
import {HOTEL_API_KEY} from '../util/constants'
import {SOCIAL_API_URL, API_CART_URL} from '../util/constants'
import qs from 'qs'

const apiCartURL = API_CART_URL
const apiInitialURL = '/get-asi-data/asiAPI'
const comTenantId = 5403

/**
 * @name        fetchMasterDataAPI
 * @description The API Call to get the master data on the srp view
 */
export const fetchMasterDataAPI = () => {
    return axios.get(`${API_URL}/masterdata`)
}

/**
 * @name   fetchMonumentListDataAPI
 * @description The API call to get first 20 monument list
 */
export const fetchMonumentListDataAPI = () => {
    let monumentListInitialData = {
        "pagination": {
          "pageNo": 1,
          "pageSize": 20
        }
    }
    return axios.post(`${API_URL}/monuments`,monumentListInitialData)
}

export const savePaxDetailsAPI = (superPNR,paxInfo) => {
    return axios({
        method:'POST',
        url:`${API_URL}/booking/${superPNR}/paxdetails`,
        headers:{'com.yatra.tenant.header.tenantId':5403},
        data:paxInfo
     })
 }

 export const getPaxDetails = (superPNR) => {
    return axios({
        method:'GET',
        url:`${API_URL}/booking/${superPNR}/summary`,
        headers:{'com.yatra.tenant.header.tenantId':5403},
     })
  }

/**
 * @name   fetchAutoSuggestAPI
 * @description The API call to get Auto suggest result
 */
export const fetchAutoSuggestAPI = (txt) => {
   return axios.get(`${API_URL}/suggestions/${txt}`)
}
export const fetchMonumentDetailsDataAPI = (monumentID) => {
	return axios({
      method:'GET',
      url:`${API_URL}/monuments/${monumentID}`,
      headers:{'com.yatra.tenant.header.tenantId':5403}
   })
}
export const hotelNearby = (cityName,checkIn,checkOut) => {
	return axios({
      method:'GET',
      url:`${HOTEL_API_URL}/v1/xsell/default/city/${cityName}?checkInDate=${checkIn}&checkOutDate=${checkOut}&apiKey=${HOTEL_API_KEY}`,
      headers:{'com.yatra.tenant.header.tenantId':5403}
   })
}
/**
 * @name        getCompleteMonumentListData
 * @description The API Call to get the complete Monument List  
 */
export const checkMonumentAvailabilityAPI = (monumentID,visitDate) => {
	return axios({
      method:'GET',
      url:`${API_URL}/booking/${monumentID}/available?visitDate=${Date.parse(visitDate)}`,
      headers:{'com.yatra.tenant.header.tenantId':5403}
   })
}

export const resendEmailAPI = (superPNR,emailId) => {
	return axios({
      method:'GET',
      url:`${API_URL}/notifications/send-email/${superPNR}/${emailId}`,
      headers:{'com.yatra.tenant.header.tenantId':5403}
   })
}
export const resendSMSAPI = (superPNR,mobileNo) => {
 return axios({
      method:'GET',
      url:`${API_URL}/notifications/send-sms/${superPNR}/${mobileNo}`,
      headers:{'com.yatra.tenant.header.tenantId':5403}
   })
}

export const confirmationDataAPI = (superPNR) => {
	return axios({
      method:'GET',
      url:`${API_URL}/booking/${superPNR}/book`,
      headers:{'com.yatra.tenant.header.tenantId':5403}
   })
}

export const checkLogin = (postData) => {
	return axios.post(`${SOCIAL_API_URL}/user/login.htm`,
	qs.stringify(postData),
	{ headers: {
      'Content-type': 'application/x-www-form-urlencoded'
      }
    })
}

export const checkRegister = (postData) => {
	return axios.post(`${SOCIAL_API_URL}/user/createUser.htm`,
	qs.stringify(postData),
	{ headers: {
      'Content-type': 'application/x-www-form-urlencoded'
      }
    })
}

export const checkFacebook = (postData) => {
	return axios.post(`${SOCIAL_API_URL}/social/login.htm`,
	qs.stringify(postData),
	{ headers: {
      'Content-type': 'application/x-www-form-urlencoded'
      }
    })
}
export const checkUserProfile = (postData) => {
	return axios.post(`${SOCIAL_API_URL}/user/userProfile.htm`,
	qs.stringify(postData),
	{ headers: {
      'Content-type': 'application/x-www-form-urlencoded'
      }
    })
}
export const checkForgotPass = (postData) => {
	return axios({
      method:'GET',
      url:`${SOCIAL_API_URL}/user/forgotPassword.htm?emailId=${postData.emailId}&includeOptionalParams=${postData.includeOptionalParams}&channel=${postData.channel}&productId=${postData.productId}`,
      headers:{'com.yatra.tenant.header.tenantId':5403}
   })
}

export const getFrescoHeader = () => {
   var frescoCall = process.env.NODE_ENV === 'production' ? 'https://www.yatra.com'  : 'http://yatra.com'
   return Vue.http.get(`${frescoCall}/monuments/apiService/getFrescoHeader`)
}
export const getFrescoFooter = () => {
   var frescoCall = process.env.NODE_ENV === 'production' ? 'https://www.yatra.com'  : 'http://yatra.com'
   return Vue.http.get(`${frescoCall}/monuments/apiService/getFrescoFooter`)
}

export const activityNearby = (hotelParams) => {
   return axios.post(`${ACT_API_URL}/`, hotelParams)
}

export const getCompleteMonumentListData = () => {
 return axios.post(`${API_URL}/monuments`,{})
}

/*export const saveMasterDataToJSON = (masterData) => {
    return axios.post(`/saveToJSON/masterData`,masterData)
}*/

export const getMasterDataFromJSON = () => {
    return axios.get(`/get-asi-data/asiAPI/masterdata`)
}

export const saveMonumentListDataFromJSON = (monumentData) => {
    return axios.post(`/saveToJSON/monumentList`,monumentdata)
}

export const getMonumentListDataFromJSON = () => {
    return axios.post(`/get-asi-data/asiAPI/monuments`,{})
}

export const retrieveCartAPI = () => {
    return axios({
      method:'POST',
      url:`${apiCartURL}/cart/retrieve-cart`,
      headers:{'com.yatra.tenant.header.tenantId': 5403},
      data: { }
    })
}

export const getCartItems = (cartId) => {
    return axios({
        method:'POST',
        url:`${apiCartURL}/item/get-items`,
        headers:{'com.yatra.tenant.header.tenantId': comTenantId},
        data: { cartId : cartId }
    })
}

export const saveMonumentToCartAPI = (items,cartId) => {
    return axios({
        method:'POST',
        url:`${apiCartURL}/item/save-items`,
        headers:{'com.yatra.tenant.header.tenantId':comTenantId},
        data: { items, cartId }
    })
}

export const cartItemCount = (cartId) => {
    return axios({
        method:'POST',
        url:`${apiCartURL}/cart/cart-item-count`,
        headers:{'com.yatra.tenant.header.tenantId':comTenantId},
        data: { cartId : cartId }
    })
}

export const checkMonumentAvailabilityAPIPost = (monumentParams) => {
    return axios({
       method:'POST',
       url:`${apiInitialURL}/booking/check-availablity`,
       headers:{'com.yatra.tenant.header.tenantId':comTenantId,'Content-type': 'application/json'},
       data: monumentParams
   })
}

export const deleteMonumentFromCartAPI = (itemIds,cartID) => {
    return axios({
        method:'POST',
        url:`${apiCartURL}/item/remove-items`,
        headers:{'com.yatra.tenant.header.tenantId':comTenantId},
        data: { itemIds, cartID }
    })
}

export const saveAdditionalDetails = (cartId, itemId, itemDetails) => {
    return axios({
        method:'POST',
        url:`${apiCartURL}/item/save-additional-details`,
        headers:{'com.yatra.tenant.header.tenantId':comTenantId},
        data: { cartId : cartId, itemId : itemId, itemDetails : itemDetails }
    })
}

export const getReviewSummaryAPI = (superPNR) => {
    return axios({
        method:'GET',
        url:(`${apiInitialURL}/booking/`+superPNR+`/review-details`),
        headers:{'com.yatra.tenant.header.tenantId':comTenantId,'Content-type': 'application/json'}
    })
}

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const MonumentSRPView = () => import('../views/monumentSRPView.vue')
const MonumentsSearchView = () => import('../views/monumentSearchView.vue')
const MonumentDetailsView = () => import('../views/monumentDetailsView.vue')
const LoginView = () => import('../views/loginView.vue')
const RegisterView = () => import('../views/registerView.vue')
const ForgotPasswordView = () => import('../views/forgotPasswordView.vue')
const AddTravellersView = () => import('../views/addTravellersView.vue')
const ReviewTravellersView = () => import('../views/reviewTravellersView.vue')
const FilterView = () => import('../views/filterView.vue')
const CartBlock = () => import('../components/common/cartBlock.vue')
const Calender = () => import('../views/calender.vue')
const MonumentPaymentView = () => import('../views/monumentPaymentView.vue')
const Confirmation = () => import('../views/confirmation.vue')
const HealthCheck = () => import('../views/healthCheck.vue')
/*const PaymentStatus = () => import('../views/PaymentStatus.vue')*/

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/pwa/monuments/srp', component: MonumentSRPView ,name:'MonumentSRPView'},
      { path: '/pwa/monuments/search', component: MonumentsSearchView ,name:'MonumentsSearchView'},
      { path: '/pwa/monuments/details', component: MonumentDetailsView ,name:'MonumentDetailsView'},
      { path: '/pwa/monuments/login', component: LoginView ,name:'LoginView'},
      { path: '/pwa/monuments/register', component: RegisterView ,name:'RegisterView'},
      { path: '/pwa/monuments/forgotpassword', component: ForgotPasswordView ,name:'ForgotPasswordView'},
      { path: '/pwa/monuments/addTraveller', component: AddTravellersView ,name:'AddTravellersView'},
      { path: '/pwa/monuments/reviewTraveller', component: ReviewTravellersView ,name:'ReviewTravellersView'},
      { path: '/pwa/monuments/payment', component: MonumentPaymentView ,name:'MonumentPaymentView'},
      { path: '/pwa/monuments/filters', component: FilterView ,name:'FilterView'},
      { path: '/pwa/monuments/cartBlock', component: CartBlock ,name:'CartBlock'},
      { path: '/pwa/monuments/calender', component: Calender ,name:'Calender'},
      { path: '/pwa/monuments/confirm', component: Confirmation ,name:'confirmation'},
      { path: '/pwa/monuments/healthCheck', component: HealthCheck ,name:'healthCheck'},
      { path: '/pwa/monuments/', redirect: '/pwa/monuments/srp' },
	    { path: '/pwa/monuments', redirect: '/pwa/monuments/srp' },
      { path: '/', redirect: '/pwa/monuments/srp' }
      
    ]
  })
}

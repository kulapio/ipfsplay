import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Buefy from 'buefy'
import VueLoading from 'vue-loading-template'
import VueClipboard from 'vue-clipboard2'
import SocialSharing from 'vue-social-sharing'

import 'buefy/lib/buefy.css'

Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(VueLoading)
VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)
Vue.use(SocialSharing)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

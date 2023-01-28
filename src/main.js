import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'
import firebaseConfig from './firebase'
import 'vuetify/dist/vuetify.min.css'
import 'vuetify/dist/vuetify.min.js'

Vue.config.productionTip = false

firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')

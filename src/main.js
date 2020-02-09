import Vue from 'vue'
// import App from './App.vue'
import App5Days from './App5days.vue'

Vue.config.productionTip = false

new Vue({
  // render: h => h(App),
  render: h => h(App5Days),
}).$mount('#app')

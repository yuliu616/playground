import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

console.log(`vue app started using NODE_ENV=${process.env.NODE_ENV}`);

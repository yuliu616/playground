import Vue from 'vue'
import App from './App.vue'
import router from './router/router-index.vue'

import 'semantic-ui-css/semantic.min.css';
import 'toastr/build/toastr.min.css';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

console.log(`vue app started using NODE_ENV=${process.env.NODE_ENV}`);

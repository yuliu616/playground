import Vue from 'vue'
import App from './App.vue'
import router from './router/router-index.vue'
import jQuery from 'jquery';

import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/semantic.js';
import 'toastr/build/toastr.min.css';

// make jquery global symbols
window.$ = jQuery;
window.jQuery = jQuery;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

console.log(`vue app started using NODE_ENV=${process.env.NODE_ENV}`);
console.log('jquery version =', jQuery.fn.jquery);

import Vue from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import router from './router/router-index';

import 'ant-design-vue/dist/antd.css';
import 'semantic-ui-css/semantic.min.css';

Vue.config.productionTip = false;

Vue.use(Antd);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

console.log(`vue app started using NODE_ENV=${process.env.NODE_ENV}`);

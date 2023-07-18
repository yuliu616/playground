import './assets/main.css';
import 'ant-design-vue/dist/antd.min.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import { useFontAwesome } from './fontAwesomeSetup';

import App from './App.vue';
import router from './router'; // import router related codes.

// localize dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // en_US
// import 'dayjs/locale/zh-cn';
// import 'dayjs/locale/ja';
dayjs.locale('en'); // en_US
// dayjs.locale('zh-cn');
// dayjs.locale('ja');

const app = createApp(App);

// enable plugins: router, state management(pinia).
app.use(createPinia());
app.use(router);
app.use(Antd);
useFontAwesome(app);

app.mount('#app');

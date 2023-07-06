import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router'; // import router related codes.

const app = createApp(App);

// enable plugins: router, state management(pinia).
app.use(createPinia());
app.use(router);

app.mount('#app');

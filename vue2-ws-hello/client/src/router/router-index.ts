import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import HomeVue from '../views/Home.vue';
import MyInfoVue from '../views/my-info.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeVue,
  },
  {
    path: '/my-info',
    name: 'my-info',
    component: MyInfoVue,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;

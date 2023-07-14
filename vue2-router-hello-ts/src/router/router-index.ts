import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import AboutVue from '@/views/About.vue';
import HomeVue from '@/views/Home.vue';
import NothingToShowVue from '@/views/NothingToShow.vue';
import PeopleEditorVue from '@/views/people/PeopleEditor.vue';
import PeopleListVue from '@/views/people/PeopleList.vue';
import PeopleViewerVue from '@/views/people/PeopleViewer.vue';
import PeopleHomeVue from '@/views/PeopleHome.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: HomeVue
  },
  {
    path: '/about',
    name: 'About',
    component: AboutVue,
  },
  {
    path: '/people',
    name: 'PeopleHome',
    component: PeopleHomeVue,
    children: [
      {
        path: '/', // for "/people/"
        redirect: 'list',
      },
      {
        path: 'list',
        name: 'PeopleList',
        component: PeopleListVue,
      },
      {
        path: 'item/:id/view',
        name: 'PeopleViewer',
        component: PeopleViewerVue,
      },
      {
        path: 'item/:id/edit',
        name: 'PeopleEditor',
        component: PeopleEditorVue,
      },
      {
        path: '*',
        component: NothingToShowVue,
      },
    ],
  },
  {
    path: '*',
    component: NothingToShowVue,
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes,
});

export default router;

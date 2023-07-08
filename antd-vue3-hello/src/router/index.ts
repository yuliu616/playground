import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Form1View from '@/views/Form1View.vue';
import MessagePlaying from '@/views/MessagePlaying.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/form1',
      name: 'form1',
      component: Form1View,
    },
    {
      path: '/message',
      name: 'message',
      component: MessagePlaying,
    },
    {
      path: '/about',
      name: 'about',
      // defined as lazy-loaded
      component: () => import('@/views/AboutView.vue'),
    },
  ]
})

export default router;

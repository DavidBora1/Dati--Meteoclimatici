// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import HomeTab from '../views/HomeTab.vue';
import GrafiTab from '../views/GrafiTab.vue';
import Top10Page from '../views/Top10Page.vue';

const routes = [
  {
    path: '/HomeTab',
    name: 'HomeTab',
    component: HomeTab,
  },
  {
    path: '/GrafiTab',
    name: 'GrafiTab',
    component: GrafiTab,
  },
  {
    path: '/Top10Page',
    name: 'Top10Page',
    component: Top10Page,
  },
  {
    path: '/',
    redirect: '/HomeTab'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import TemperaturePage from '../views/TemperaturePage.vue';
import PrecipitationPage from '../views/PrecipitationPage.vue';
import Top10Page from '../views/Top10Page.vue';
import DataEntryPage from '../views/DataEntryPage.vue';

const routes = [
  {
    path: '/temperature',
    name: 'temperature',
    component: TemperaturePage,
  },
  {
    path: '/precipitation',
    name: 'precipitation',
    component: PrecipitationPage,
  },
  {
    path: '/top10',
    name: 'top10',
    component: Top10Page,
  },
  {
    path: '/data-entry',
    name: 'data-entry',
    component: DataEntryPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

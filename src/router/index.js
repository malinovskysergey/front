// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import PersonDetail from '../views/PersonDetail.vue'; // New component

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/p/:id',
    name: 'PersonDetail',
    component: PersonDetail,
    props: true, // Allows route params to be passed as props
  },
  // ... other routes
];

const router = createRouter({
  history: createWebHistory('https://last-production-ebba.up.railway.app/api'),
  routes,
});

export default router;

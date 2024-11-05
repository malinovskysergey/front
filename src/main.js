// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'mapbox-gl/dist/mapbox-gl.css'; // Add this line to import the CSS

createApp(App).use(router).mount('#app');

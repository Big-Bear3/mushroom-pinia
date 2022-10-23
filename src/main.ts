import { createApp } from 'vue';
import App from './App.vue';

import { mushroomPinia } from './mushroom-pinia-core/src';

import './assets/main.css';

const app = createApp(App);

app.use(mushroomPinia);

app.mount('#app');

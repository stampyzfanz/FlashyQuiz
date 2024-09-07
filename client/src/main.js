/**
 * Initialises the Vue framework
 */
import { createApp } from 'vue'
import App from './App.vue'
import socketUtilPlugin from './socketUtil';

const app = createApp(App);
app.use(socketUtilPlugin, { url: "http://localhost:3000" });
app.mount('#app');

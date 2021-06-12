import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import styles from './styles/styles.scss';
import VueCookiese from 'vue3-cookies';

createApp(App)
    .use(router)
    .use(styles)
    .use(VueCookiese)
    .mount('#app')

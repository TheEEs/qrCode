import {
    createApp
} from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import 'remixicon/fonts/remixicon.css'

import GenerateView from './components/GenerateView'
import HomeView from './components/HomeView'
import ScanView from './components/ScanView'
import {
    createRouter,
    createWebHashHistory,
} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
            path: '/gen',
            component: GenerateView
        },
        {
            path: '/',
            component: HomeView
        },
        {
            path: '/scan',
            component: ScanView
        }
    ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')


if ('serviceWorker' in navigator) {
    console.log(`${process.env.BASE_URL}service-worker.js`);
    navigator.serviceWorker.register(`${process.env.BASE_URL}service-worker.js`, {
        scope: '/'
    }).then((registration) => {
        if (registration.installing) {
            console.log("Service worker is installing");
        } else if (registration.waiting) {
            console.log("Service worker installed");
        } else if (registration.active) {
            console.log("Service worker activated");
        }
    }).catch((e) => {
        console.error(`Service worker installation was cancelled due to error: ${e}`);
    })
}
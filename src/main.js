import {
    createApp
} from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import 'remixicon/fonts/remixicon.css'
import 'animate.css'

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

if ('serviceWorker' in navigator) {
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

document.addEventListener("DOMContentLoaded", function () {
    let installButton = document.getElementById("install-app")
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        installButton.classList.remove('hidden')
        installButton.classList.add('flex')
        console.log("HEHEHE")
        let deferredPrompt = e;
        installButton.addEventListener("click", () => {
            console.log("HEHE")
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((result) => {
                if (result.outcome === 'accepted') {
                    console.log("User accepted to install the app");
                } else {
                    console.log("User denied to install the app");
                }
                installButton.classList.remove('flex')
                installButton.classList.add('hidden')
            })
        })
    })
})


const app = createApp(App)
app.use(router)
app.mount('#app')
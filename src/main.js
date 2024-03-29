import {
    createApp
} from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import 'remixicon/fonts/remixicon.css'
import 'animate.css'

import GenerateView from "./components/GenerateView.vue";
import HomeView from './components/HomeView.vue';
import ScanView from './components/ScanView.vue';
import FileUpLoadView from './components/FileUploadView.vue';
import FoldersView from "./components/FoldersView.vue";
import {
    createRouter,
    createWebHashHistory,
} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/gen',
        component: GenerateView,
        meta: {

        }
    },
    {
        path: '/',
        component: HomeView,
        meta: {

        }
    },
    {
        path: '/scan',
        component: ScanView,
        meta: {

        }
    },
    {
        path: '/file_sharing',
        component: FileUpLoadView,
        meta: {
            transition_in: "animate__bounceIn",
            transition_out: "animate__bounceOut"
        }
    },
    {
        path: '/folders/:id',
        component: FoldersView,
        meta: {
            transition_in: "animate__bounceIn",
            transition_out: "animate__bounceOut"
        }
    }
    ]
})


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(new URL('./service-worker.js', import.meta.url), {
        type: 'module',
        scope: "/"
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
        let deferredPrompt = e;
        installButton.addEventListener("click", () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((result) => {
                if (result.outcome === 'accepted') {
                    console.log("User accepted to install the app");
                } else {
                    console.log("User denied to install the app");
                }
            })
            installButton.classList.remove('flex')
            installButton.classList.add('hidden')
        })
    })
})


const app = createApp(App)
app.use(router)
app.mount('#app')
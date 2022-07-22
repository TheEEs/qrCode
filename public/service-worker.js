const CACHE_VERSION = 'v1';

self.addEventListener("install", (e) => {
    console.log("Service worker's installing");
})

self.addEventListener("activate", e => {
    e.waitUntil(
        (async () => {
            const cacheKeepList = [CACHE_VERSION];
            const keyList = await caches.keys();
            const cacheToDelete = keyList.filter(k => !cacheKeepList.includes(k));
            await Promise.all(
                cacheToDelete.map(async (k) => {
                    await caches.delete(k)
                })
            )
            console.log("Old caches removed");
        })()
    )
})

const ACCEPTED_CACHE_TYPES = ['image', 'script']

self.addEventListener("fetch", (event) => {
    const request = new Request(event.request.url, { mode: "cors" })
    console.log(request)
    //if (ACCEPTED_CACHE_TYPES.includes(event.destination))
    event.respondWith(caches.open(CACHE_VERSION).then(cache => {
        return cache.match(request).then(cached_response => {
            return cached_response || fetch(request).then((response) => {
                event.waitUntil(cache.put(request, response.clone()))
                return response;
            })
        })
    }))
})
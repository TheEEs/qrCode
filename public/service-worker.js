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



self.addEventListener("fetch", event => {
    const request = event.request;
    console.log(request)
    event.respondWith(
        caches.match(request).then((cached_result) => {
            if (cached_result) return cached_result;
            return fetch(request).then(response => {
                const copy = response.clone()
                event.waitUntil(caches.open(CACHE_VERSION).then(cache => {
                    return cache.put(request, copy);
                }))
                return response;
            })
        })
    )
})
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



self.addEventListener("fetch", (e) => {
    e.respondWith((async () => {
        try {
            const response = await fetch(e.request);
            const cache = await caches.open('v8');
            cache.put(e.request, response.clone());
            return response;
        } catch (e) {
            return await caches.match(e.request)
        }
    })())
})
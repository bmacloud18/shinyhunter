const STATIC_CACHE_NAME = 'shiny-hunter-static-v0';
import api from './js/APIclient.js';

const assets = [
    '/userprofile',
    // '/huntsettings',
    '/activehunt',
    '/finishedhunt',
    //css
    '/css/activehunt.css',
    '/css/button.css',
    '/css/finishedhunt.css',
    '/css/header.css',
    '/css/huntsettings.css',
    '/css/login.css',
    '/css/signup.css',
    '/css/success.css',
    '/css/userprofile.css',
    '/css/usersettings.css',
    //javascript
    '/js/activehunt.js',
    '/js/APIclient.js',
    '/js/finisedhunt.js',
    '/js/getPage.js',
    '/js/header.js',
    '/js/HTTPclient.js',
    '/js/huntsettings.js',
    '/js/login.js',
    '/js/serviceWorker.js',
    '/js/userprofile.js',
    '/js/usersettings.js',
    '/js/easytimer.js/src/easytimer/easytimer.js',
    //images
]
    
self.addEventListener('install', e => {
    e.waitUntil(caches.open(STATIC_CACHE_NAME).then( cache => {
        return cache.addAll(assets);
    }));
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.filter(name => { 
            return name.startsWith('shiny-hunter-') && name != STATIC_CACHE_NAME;
        }).map(name => {
            return caches.delete(name);
        }));
    }));
});


async function fetchFirst(req) {
    return fetch(req).then(res => {
        if (res) {
            const requestURL = new URL(req.url);
            if (res.ok && !requestURL.pathname.startsWith('/sign')) {
                caches.open(STATIC_CACHE_NAME).then(cache => {
                    //refresh specified cache
                    cache.delete(requestURL);
                    cache.add(req);
                });
            }
            return res.clone();
        }
    //offline
    }).catch( () => {
        return caches.match(req).then(res => {
            return res || caches.match('/offline');
        }).catch( () => {
            return caches.match('/offline');
        });
    });
    
}

self.addEventListener('fetch', e => {
    const requetURL = new URL(e.request.url);
    if (requestURL.origin === location.origin && requestURL.pathname.startsWith('/api')) {
        if (e.request.method === 'GET') {
            e.respondWith(fetchFirst(e.request));
        }
    }
    else {
        e.respondWith(fetchFirst(e.request));
    }
});

self.addEventListener('message', e => {
    if (e.data.action === 'skipWaiting')
        self.skipWaiting();
});

function getDataFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function sync() {
    const hunt = getDataFromLocalStorage('hunt');
    const stopwatch = getDataFromLocalStorage('stopwatchData');
    const counter = getDataFromLocalStorage('counterData');

    const newtime = hunt.hunt_time + stopwatch.elapsedTime;
    const count = counter.counter;

    api.updateHunt(hunt.id, hunt.start_date, newtime, count, hunt.increment, hunt.charm, hunt.nickname).then(res => {
        if (res.ok) {
            removeDataFromLocalStorage('hunt');
            removeDataFromLocalStorage('stopwatchData');
            removeDataFromLocalStorage('counterData');
        }
        else {
            console.error('Failed to sync data with server: ', response.status);
        }
    }).catch(err => {
        console.error('Error syncing data with server: ', err);
    });
}

self.addEventListener('sync', e => {
    if (e.tag === 'syncData') {
        e.waitUntil(sync());
    }
});

function triggerSync() {
    self.registration.sync.register('syncData');
}

window.addEventListener('online', () => {
    triggerSync();
});
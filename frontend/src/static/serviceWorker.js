const STATIC_CACHE_NAME = 'shiny-hunter-static-v0';
const API_BASE = './api/';
const assets = [
    // '/userprofile',
    // // '/huntsettings',
    // '/activehunt',
    // '/finishedhunt',
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
    '/js/finishedhunt.js',
    '/js/getPage.js',
    '/js/header.js',
    '/js/HTTPclient.js',
    '/js/huntsettings.js',
    '/js/login.js',
    // '/js/serviceWorker.js',
    '/js/userprofile.js',
    '/js/usersettings.js',
    '/js/easytimer.js/src/easytimer/easytimer.js'
    //images
];
    
self.addEventListener('install', e => {
    e.waitUntil(caches.open(STATIC_CACHE_NAME).then(cache => {
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
            if (res.ok && req.method === 'GET') {
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
    const requestURL = new URL(e.request.url);
    if (requestURL.origin === location.origin && requestURL.pathname.startsWith('/api')) {
        if (e.request.method === 'GET') {
            e.respondWith(fetchFirst(e.request));
        }
    }
    else if (e.request.method !== 'POST' || e.request.method !== 'PUT'){
        e.respondWith(fetchFirst(e.request));
    }
});

self.addEventListener('message', e => {
    if (e.data.action === 'skipWaiting')
        self.skipWaiting();
    else if (e.data.action === 'online') {
        triggerSync();
    }
});

function getDataFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

const handleError = (res) => {
    if(!res.ok) {
        if(res.status == 401) {
            localStorage.removeItem('user');
            document.location = './signin';
            throw new Error("Unauthenticated");
        }
        else {
            throw new Error(res.status);
        }
    }
    
    return res;
};

function sync() {
    const hunt = getDataFromLocalStorage('hunt');
    const stopwatch = getDataFromLocalStorage('stopwatchData');
    const counter = getDataFromLocalStorage('counterData');


    if (hunt && stopwatch && counter) {
        const newtime = hunt.hunt_time + stopwatch.elapsedTime;
        const count = counter.counter;

        const data = {
            time: newtime,
            start_date: hunt.start_date_string,
            end_date: hunt.end_date_string,
            count: count,
            increment: hunt.increment,
            charm: hunt.charm,
            nickname: hunt.nickname
        };

        const url = `hunt/${hunt.id}`

        fetch(API_BASE + url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.ok) {
                localStorage.removeItem('hunt');
                localStorage.removeItem('stopwatchData');
                localStorage.removeItem('counterData');
                console.log('update sent, local storage removed');
            }
            else {
                console.error('Failed to sync data with server: ', res.status);
            }
        });
    }
}

self.addEventListener('sync', e => {
    if (e.tag === 'syncData') {
        e.waitUntil(sync());
    }
});

function triggerSync() {
    self.registration.sync.register('syncData');
}
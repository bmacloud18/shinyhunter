const STATIC_CACHE_NAME = 'shiny-hunter-static-v0';

const assets = [
    '/offline',
    // css
    '/css/activehunt.css',
    '/css/finishedhunt.css',
    '/css/header.css',
    '/css/huntsettings.css',
    '/css/login.css',
    '/css/userprofile.css',
    // '/css/usersettings.css',
    // '/css/success.css',
    '/css/signup.css',
    // js
    '/js/APIclient.js',
    '/js/esaytimer.js',
    '/js/activehunt.js',
    '/js/finishedhunt.js',
    '/js/getPage.js',
    '/js/header.js',
    '/js/huntsettings.js',
    '/js/login.js',
    '/js/serviceWorker.js',
    '/js/HTTPclient.js',
    // '/js/usersettings.js',
    '/js/storageHandler.js',
    '/js/signIn.js',
    '/js/signUp.js',
    '/js/profile.js',
    // images'
    '/images/Arrowhead_Stadium_Lot.jpeg',
    '/images/Arrowhead_Stadium.png',
    '/images/barcode.png',
    '/images/BOA_Stadium_Lot.png',
    '/images/BOA_Stadium.png',
    '/images/ER.pdf',
    '/images/evt_1_bathroom.png',
    '/images/evt_1_services.png',
    '/images/evt_1_vendor.png',
    '/images/evt_2_vendor.png',
    '/images/evt_3_bathroom.png',
    '/images/evt_3_services.png',
    '/images/evt_3_vendor.png',
    '/images/evt_4_bathroom.png',
    '/images/evt_4_services.png',
    '/images/evt_4_vendor.png',
    '/images/icons8-alarm-50.png',
    '/images/icons8-bathroom-50.png',
    '/images/icons8-check-30.png',
    '/images/icons8-download-50.png',
    '/images/icons8-folder-50.png',
    '/images/icons8-hamburger-50.png',
    '/images/icons8-health-32.png',
    '/images/icons8-help-50.png',
    '/images/icons8-home-50.png',
    '/images/icons8-info-50.png',
    '/images/icons8-link-24.png',
    '/images/icons8-loading.gif',
    '/images/icons8-location-50.png',
    '/images/icons8-parking-50.png',
    '/images/icons8-schedule-50.png',
    '/images/icons8-search-50.png',
    '/images/icons8-seat-50.png',
    '/images/icons8-settings-50.png',
    '/images/icons8-user-24.png',
    '/images/icons8-vendor-24.png',
    '/images/icons8-wallet-50.png',
    '/images/LO_Stadium_Lot.png',
    '/images/LO_Stadium.png',
    '/images/PNC_Arena_Lot.jpeg',
    '/images/PNC_Arena.jpg',
    '/images/qrcode_github.ncsu.edu.png',
    '/images/stadium.png',
    '/images/star_0.png',
    '/images/tkt_1_lot.png',
    '/images/tkt_1_seat.png',
    '/images/tkt_2_seat.png',
    '/images/tkt_3_lot.png',
    '/images/tkt_3_seat.png',
    '/images/tkt_4_seat.png',
    '/images/tkt_5_seat.png',
    '/images/tkt_6_seat.png',
    '/images/tkt_7_seat.png',
    '/images/tkt_8_lot.png',
    '/images/tkt_8_seat.png',
    // icons
    '/icons/android-chrome-192x192.png',
    '/icons/android-chrome-512x512.png',
    '/icons/apple-touch-icon.png',
    '/icons/favicon-16x16.png',
    '/icons/favicon-32x32.png',
    '/icons/favicon.ico',
    '/icons/mstile-70x70.png',
    '/icons/mstile-150x150.png',
    '/icons/mstile-310x310.png',
    '/icons/safari-pinned-tab.svg',
];

self.addEventListener( 'install', e => {  
    e.waitUntil( caches.open( STATIC_CACHE_NAME ).then( cache => {
        return cache.addAll( assets );
    }) );
});

self.addEventListener( 'activate', e => {
    e.waitUntil( caches.keys().then( cacheNames => {
        return Promise.all( cacheNames.filter( name => {
            return name.startsWith( 'my-stadium-navigator-' ) && name != STATIC_CACHE_NAME;
        }).map( name => {
            return caches.delete( name );
        }) );
    }) );
});

// async function fetchAndCache( req ) {
//     return fetch( req ).then( res => {
//         const requestURL = new URL( req.url );
//         if ( res.ok && !requestURL.pathname.startsWith( '/sign-' ) && !requestURL.pathname.startsWith( '/guest' ) ) {
//             caches.open( STATIC_CACHE_NAME ).then( cache => {
//                 cache.put( req, res );
//             });
//         }
//         return res.clone();
//     });
// }

// async function cacheFirst( req ) {
//     return caches.match( req ).then( res => {
//         return res || fetchAndCache( req );
//     }).catch( () => {
//         return caches.match( '/offline' );
//     });
// }

async function fetchFirst( req ) {
    return fetch( req ).then( res => {
        //the server responded ok and will save anything in cache
        if (res) {
            const requestURL = new URL( req.url );
            if ( res.ok && !requestURL.pathname.startsWith( '/sign-' ) && !requestURL.pathname.startsWith( '/guest' ) ) {
                caches.open( STATIC_CACHE_NAME ).then( cache => {
                    //refresh the called cache
                    cache.delete( requestURL );
                    cache.add( req );
                });
            }
            return res.clone();
        }
    //are offline     
    }).catch( () => {
        return caches.match( req ).then( res => {
            return res || caches.match( '/offline' );
        }).catch( () => {//dont need?
            return caches.match( '/offline' );
        });
    });
}

self.addEventListener( 'fetch', e => {
    const requestURL = new URL( e.request.url );
    if ( requestURL.origin === location.origin && requestURL.pathname.startsWith( '/api' ) ) {
        if ( e.request.method === 'GET' )
            e.respondWith( fetchFirst( e.request ) );
    } else
        e.respondWith( fetchFirst( e.request ) );
});

self.addEventListener( 'message', e => {
    if ( e.data.action === 'skipWaiting' )
        self.skipWaiting();
});
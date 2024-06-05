export default function registerServiceWorker() {
    function newServiceWorker(worker) {
        worker.postMessage( {action: 'skipWaiting'});
    }
    
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register('/serviceWorker.js').then(reg => {
            if (navigator.serviceWorker.controller) {
                if (reg.installing)
                    console.log('service worker installing...');
                else if (reg.waiting) {
                    console.log('service worker installed, but waiting');
                    newServiceWorker(reg.waiting);
                }
                else if (reg.active)
                    console.log('service worker active');

                reg.addEventListener('updatefound', () => {
                    console.log('SW update found', reg, navigator.serviceWorker.controller);
                    newServiceWorker(reg.installing);
                });
            }
        }).catch(err => {
            console.error('Registration failed: ' + err);
        });

        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing)
                return;

            location.reload();
            refreshing = true;
        });
    }

    // Listen for online event
    window.addEventListener('online', () => {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'online' });
        }
    });
}


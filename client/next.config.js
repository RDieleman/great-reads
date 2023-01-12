const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching: [{
        urlPattern: ({url}) => {
            const isSameOrigin = self.origin === url.origin;
            if (!isSameOrigin) return false;
            const pathname = url.pathname;

            return pathname.startsWith('/api/book-info/volume');
        },
        handler: 'CacheFirst',
        method: 'GET',
        options: {
            cacheName: 'books',
            expiration: {
                maxAgeSeconds: 3600 * 24 * 30 // 1 month
            }
        }
    }, {
        urlPattern: ({url}) => {
            const isSameOrigin = self.origin === url.origin;
            if (!isSameOrigin) return false;
            const pathname = url.pathname;

            return pathname.startsWith('/api/users/me');
        },
        handler: 'NetworkFirst',
        method: 'GET',
        options: {
            cacheName: 'user',
            expiration: {
                maxEntries: 1
            }
        }
    }, {
        urlPattern: ({url}) => {
            const isSameOrigin = self.origin === url.origin;
            if (!isSameOrigin) return false;
            const pathname = url.pathname;
            return pathname.startsWith('/api/book-info/search');
        },
        handler: 'CacheFirst',
        method: 'GET',
        options: {
            cacheName: 'search',
            expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 10 // 10 minutes
            }
        }
    }, {
        urlPattern: ({url}) => {
            const isSameOrigin = self.origin === url.origin;
            if (!isSameOrigin) return false;
            const pathname = url.pathname;

            return pathname.startsWith('/api/');
        },
        handler: 'NetworkFirst',
        method: 'GET',
        options: {
            cacheName: 'generic-backend',
            expiration: {
                maxAgeSeconds: 3600 * 24 * 30 // 1 month
            }
        }
    }]
})

module.exports = withPWA({
    // next.js config

})

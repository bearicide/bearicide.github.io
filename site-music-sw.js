const CSS = '<link rel="stylesheet" href="/assets/site-music.css">';
const JS = '<script src="/assets/site-music.js"></script>';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/assets/') || url.pathname.includes('/admin/')) return;

  const accept = request.headers.get('accept') || '';
  if (!accept.includes('text/html')) return;

  event.respondWith((async () => {
    const response = await fetch(request);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;

    let html = await response.text();
    if (!html.includes('/assets/site-music.css')) {
      html = html.replace('</head>', `${CSS}</head>`);
    }
    if (!html.includes('/assets/site-music.js')) {
      html = html.replace('</body>', `${JS}</body>`);
    }

    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-cache'
      }
    });
  })());
});

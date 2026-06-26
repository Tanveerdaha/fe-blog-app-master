# Deployment — SPA routing

This app uses client-side routing (`BrowserRouter`). The host must serve `index.html` for all routes so refresh and direct links work.

## Vercel

Uses [`vercel.json`](vercel.json) — all paths rewrite to `/index.html`.

## Netlify

Uses [`public/_redirects`](public/_redirects) — `/* /index.html 200`.

## Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Railway / static file server

Configure a catch-all route to `index.html` for non-file requests.

## Environment

Set `VITE_API_URL` at build time to your backend origin (e.g. `https://be-blog-app-master-production.up.railway.app`). Leave empty in local dev to use the Vite proxy in `vite.config.js`.

# Frontend — Draftcode Blog

React + Vite + Redux blog client for the MERN blog app.

## Setup

```bash
cd fe-blog-app-master
cp .env.example .env
npm install
```

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend origin. Leave **empty** in local dev to use the Vite proxy. Set for production builds (e.g. Netlify). |

## Run

```bash
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

## Backend

Start the API from `be-blog-app-master` (`npm run dev` on port 5000). Update `vite.config.js` proxy target if not using the default Railway URL.

## Features

- Public blog listing and detail pages
- User auth (email + Google via Firebase)
- Admin dashboard (blogs, users, comments) — admins can promote/demote users from **Dashboard → Users**
- Dark/light theme

## Deployment

1. Deploy the backend (`be-blog-app-master`) with MongoDB Atlas and required env vars (see backend README).
2. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` on first deploy to bootstrap the initial admin automatically.
3. Build with production API URL:

```bash
VITE_API_URL=https://your-backend.example.com npm run build
```

4. Deploy the `dist` folder to Netlify, Vercel, or similar.

See `be-blog-app-master/README.md` for full deployment and admin setup details.

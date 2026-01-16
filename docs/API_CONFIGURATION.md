# API Configuration Guide

## Backend Connection Setup

### Overview
Both `customer` and `hotel-owner` apps are now configured to connect to the **Hotel SAAS Backend** running on `http://localhost:5293`.

---

## Configuration Files

### 1. Next.js Proxy Configuration
Each app's `next.config.mjs` includes a proxy rewrite rule:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:5293/:path*',
    },
  ];
}
```

**How it works:**
- Frontend makes requests to `/api/auth/login`
- Next.js rewrites it to `http://localhost:5293/auth/login`
- This avoids CORS issues during development

---

### 2. Environment Variables

Each app has an `.env.local` file:

```env
# API Base URL (relative path, proxied by Next.js)
NEXT_PUBLIC_API_URL=/api

# Cloudflare R2 CDN for images
NEXT_PUBLIC_CDN_URL=https://pub-2f884047d0ec47659cb43e0b335d7d23.r2.dev
```

**Important:**
- `.env.local` files are **NOT committed** to git (already in .gitignore)
- These files are **development-only**
- For production, set these in your deployment environment

---

## API Package (`packages/api`)

The `@repo/api` package uses the environment variable:

```typescript
// packages/api/src/http.ts
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
});
```

---

## Testing the Connection

### 1. Start the Backend
```bash
cd Hotel-SAAS-Backend/Hotel-SAAS-Backend.API
dotnet watch run
```
Backend should be running on: `http://localhost:5293`

### 2. Start the Frontend
```bash
cd hotel_frontend
pnpm run dev
```

### 3. Test API Calls
- **Customer App**: http://localhost:3000
- **Hotel Owner App**: http://localhost:3001

Try logging in - the requests will be proxied to the backend.

---

## Backend CORS Configuration

The backend is already configured to accept requests from Next.js:

```json
// appsettings.json
"Cors": {
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://your-frontend-domain.com"
  ]
}
```

**Note:** Port `3000` is the default Next.js dev port for customer app.

---

## Image Hosting (Cloudflare R2)

Images are hosted on Cloudflare R2:
- **Public URL**: `https://pub-2f884047d0ec47659cb43e0b335d7d23.r2.dev`
- **Bucket**: `smartpath-storage`

Added to `next.config.mjs` image remote patterns for Next.js Image component:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'pub-2f884047d0ec47659cb43e0b335d7d23.r2.dev',
    },
  ],
}
```

---

## Troubleshooting

### API calls failing?

1. **Check backend is running:**
   ```bash
   curl http://localhost:5293/health
   ```

2. **Check Next.js proxy:**
   - Open browser DevTools
   - Network tab
   - Look for `/api/*` requests
   - Should see 200 or backend error (not 404)

3. **CORS errors:**
   - Make sure `withCredentials: true` in axios config
   - Check backend CORS settings

### Need to restart?

After changing `next.config.mjs` or `.env.local`:
```bash
# Stop dev server (Ctrl+C)
pnpm run dev
```

---

## Production Deployment

For production, you need to:

1. **Set environment variables** in your hosting platform:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.com/api
   ```

2. **Remove rewrites** or update to production backend URL

3. **Configure backend CORS** to accept your production domain

---

## Summary

✅ **Customer App** → Proxies `/api/*` to `http://localhost:5293`  
✅ **Hotel Owner App** → Proxies `/api/*` to `http://localhost:5293`  
✅ **Environment Variables** → Configured with `.env.local`  
✅ **Image CDN** → Cloudflare R2 support added  
✅ **API Package** → Uses `NEXT_PUBLIC_API_URL` environment variable  

All set! Your apps should now communicate with the Hotel SAAS Backend. 🎉

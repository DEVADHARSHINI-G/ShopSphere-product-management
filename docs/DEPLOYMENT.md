# 🚀 Deployment Guide

## Option 1: Render (Recommended for Full-Stack)

Render supports both Node.js backend and static frontend.

### Steps:
1. Push your code to a GitHub repository
2. Go to [render.com](https://render.com) and sign up
3. Click **New → Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name:** shopsphere-api
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
6. Add environment variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=your_production_secret`
   - `JWT_EXPIRE=7d`
7. Click **Create Web Service**

The `render.yaml` file in the project root can also be used for automatic configuration.

---

## Option 2: Vercel

Best for frontend deployment with serverless API.

### Steps:
1. Install Vercel CLI: `npm i -g vercel`
2. From the project root, run: `vercel`
3. Follow the prompts to link your project
4. For production: `vercel --prod`

The `vercel.json` configures:
- Backend routes via `/api/*` → Express serverless function
- Frontend served as static files

### Environment Variables (Vercel Dashboard):
```
JWT_SECRET=your_production_secret
JWT_EXPIRE=7d
NODE_ENV=production
```

---

## Option 3: Netlify

Best for frontend deployment. Backend needs separate hosting.

### Frontend Only:
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --dir=frontend`
3. For production: `netlify deploy --prod --dir=frontend`

### Full Stack:
1. Deploy backend on Render or Railway
2. Update `API_BASE` in `frontend/js/api.js` to point to your backend URL
3. Deploy frontend on Netlify

The `netlify.toml` configures redirects for SPA routing.

---

## Environment Variables

For all deployments, set these environment variables:

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `JWT_SECRET` | Random secure string | Yes |
| `JWT_EXPIRE` | `7d` | Optional |
| `PORT` | `5000` | Optional |

### Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Post-Deployment Checklist

- [ ] All environment variables are set
- [ ] API health check returns success: `/api/health`
- [ ] Database is created with seed data
- [ ] User registration and login work
- [ ] Products load correctly
- [ ] Cart and checkout flow work
- [ ] Admin dashboard is accessible

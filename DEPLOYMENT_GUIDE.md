# Deployment Guide - Ramdip Political Portfolio

This guide provides step-by-step instructions to deploy the Ramdip application to production.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Deployment Options](#deployment-options)
4. [Post-Deployment Verification](#post-deployment-verification)

---

## Pre-Deployment Checklist

- [ ] All code committed and pushed to GitHub
- [ ] Environment variables configured
- [ ] MongoDB Atlas database ready
- [ ] Admin user seeded in production database
- [ ] Build passes without errors (`npm run build`)
- [ ] All API endpoints tested
- [ ] Blog system verified with test posts
- [ ] SSL certificate ready (for HTTPS)

---

## Environment Setup

### 1. Production Environment Variables

Create a `.env.production.local` file with production credentials:

```bash
MONGODB_URI="mongodb+srv://produser:prodpass@prod-cluster.mongodb.net/ramdip?retryWrites=true&w=majority"
NEXTAUTH_SECRET="your-secure-production-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

**⚠️ Security Notes:**
- Never commit `.env` files to git
- Use strong, unique `NEXTAUTH_SECRET`
- Use separate MongoDB cluster for production
- Enable IP whitelist in MongoDB Atlas
- Use environment-specific credentials

### 2. MongoDB Production Setup

1. **Create Production Database:**
   - Go to MongoDB Atlas
   - Create a new cluster (e.g., "ramdip-prod")
   - Configure backup and monitoring
   - Set up IP whitelist for your server

2. **Seed Admin User:**
   ```bash
   curl -X POST https://yourdomain.com/api/admin/seed \
     -H "Content-Type: application/json"
   ```

3. **Database Optimization:**
   - Enable compression
   - Set up indexes for blog posts
   - Configure connection pooling

---

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

**Advantages:**
- Zero-config deployment
- Automatic SSL/HTTPS
- Built-in analytics
- Free tier available
- Automatic previews for PRs

**Steps:**

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select "Next.js" framework

3. **Configure Environment Variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add the following:
     - `MONGODB_URI` (production)
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL` (your production domain)
     - `NODE_ENV=production`

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy

5. **Domain Setup:**
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Option 2: Railway

**Steps:**

1. **Push to GitHub**

2. **Connect Railway:**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Authorize and select repository

3. **Add Environment Variables:**
   - Click on your project
   - Go to Variables
   - Add production environment variables

4. **Add MongoDB Plugin:**
   - Click "Add"
   - Select "MongoDB"
   - Railway will create and manage MongoDB

5. **Deploy:**
   - Railway deploys automatically on git push

### Option 3: AWS/Heroku/DigitalOcean

**For Docker deployment:**

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:20-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Deploy:**
   ```bash
   docker build -t ramdip:latest .
   docker push your-registry/ramdip:latest
   ```

3. **Deploy Container:**
   - Use your cloud provider's container service
   - Set environment variables
   - Configure MongoDB connection
   - Set up health checks

### Option 4: Traditional VPS (DigitalOcean, Linode, AWS EC2)

**Steps:**

1. **Setup Server:**
   ```bash
   # SSH into your server
   ssh root@your_server_ip
   
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Clone Repository:**
   ```bash
   cd /var/www
   git clone https://github.com/tutorialsmaterial200/ramdip.git
   cd ramdip
   npm install
   ```

3. **Configure Environment:**
   ```bash
   nano .env.production.local
   # Add production variables
   ```

4. **Build Application:**
   ```bash
   npm run build
   ```

5. **Start with PM2:**
   ```bash
   pm2 start npm --name "ramdip" -- start
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx Reverse Proxy:**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/ramdip
   ```

   Add configuration:
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
   
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

7. **Enable SSL with Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Post-Deployment Verification

### 1. Health Checks

```bash
# Test homepage
curl https://yourdomain.com

# Test blog API
curl https://yourdomain.com/api/blog

# Test admin login
curl -X POST https://yourdomain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### 2. Verify Features

- [ ] Homepage loads correctly
- [ ] Navigation links work
- [ ] Blog posts display
- [ ] Admin panel accessible
- [ ] Create/Edit/Delete blog posts works
- [ ] Images load properly
- [ ] Mobile responsive
- [ ] SSL certificate valid

### 3. Performance Optimization

```bash
# Check build size
npm run build
# Should be under 100MB

# Test Core Web Vitals
# Use PageSpeed Insights: https://pagespeed.web.dev/
```

### 4. Monitoring

Set up monitoring for:
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Analytics (Vercel Analytics, Google Analytics)
- Database performance (MongoDB Atlas)

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### MongoDB Connection Error

- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity
- Verify credentials

### Admin Login Not Working

- Seed admin user: `curl -X POST https://yourdomain.com/api/admin/seed`
- Check `NEXTAUTH_SECRET` matches
- Verify cookies are enabled

### Images Not Loading

- Ensure images are in `public/` directory
- Check image paths are correct
- Verify CDN configuration if using one

---

## Performance Tips

1. **Optimize Images:**
   - Use Next.js Image component
   - Compress images before uploading
   - Use WebP format where supported

2. **Database:**
   - Add indexes for frequently queried fields
   - Archive old blog posts
   - Use read replicas for high traffic

3. **Caching:**
   - Enable Vercel Edge Caching
   - Configure ISR (Incremental Static Regeneration)
   - Cache API responses

4. **SEO:**
   - Add meta tags
   - Create sitemap
   - Submit to search engines

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Admin credentials changed from default
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] SQL/NoSQL injection prevented
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Regular security updates

---

## Support & Resources

- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
- **Node.js Best Practices:** https://nodejs.org/en/docs/guides/

---

**Last Updated:** November 30, 2025
**Version:** 1.0.0

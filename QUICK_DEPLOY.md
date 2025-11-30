# Production Deployment - Quick Start

## ⚡ 5-Minute Deployment to Vercel (Recommended)

### Step 1: Prepare Your Environment
```bash
# Copy environment template
cp .env.example .env.production.local

# Edit with your production credentials
nano .env.production.local
```

**Required variables:**
- `MONGODB_URI` - Production MongoDB connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your production domain (e.g., https://yourdomain.com)

### Step 2: Connect to Vercel
1. Push your code to GitHub (already done ✅)
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select "ramdip" repository
5. Vercel auto-detects Next.js framework ✅

### Step 3: Add Environment Variables
In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add all three variables from `.env.production.local`
3. Click "Save"

### Step 4: Deploy
1. Click "Deploy" button
2. Wait for build to complete (~2-3 minutes)
3. Get your production URL: `https://ramdip.vercel.app`

### Step 5: Add Custom Domain
1. In Vercel Dashboard → Domains
2. Add your custom domain
3. Update DNS records (Vercel will show instructions)
4. Wait for DNS propagation (~24 hours)

---

## 🐳 Docker Deployment

### Quick Local Test
```bash
# Build image
docker build -t ramdip:latest .

# Run container
docker run -p 3000:3000 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  ramdip:latest
```

### With Docker Compose
```bash
# Set environment variables
export MONGODB_URI="your-mongodb-uri"
export NEXTAUTH_SECRET="your-secret"
export NEXTAUTH_URL="https://yourdomain.com"

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

---

## 🚀 VPS Deployment (DigitalOcean / Linode / AWS EC2)

### 1. Create Server
- OS: Ubuntu 22.04 LTS
- Size: Minimum 1GB RAM (recommended 2GB)
- Region: Choose closest to your users
- Add SSH key for secure access

### 2. Connect & Setup
```bash
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Install PM2
npm install -g pm2
```

### 3. Deploy Application
```bash
cd /var/www
git clone https://github.com/tutorialsmaterial200/ramdip.git
cd ramdip

# Create environment file
cat > .env.production.local << EOF
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
EOF

# Install and build
npm install
npm run build

# Start with PM2
pm2 start npm --name "ramdip" -- start
pm2 save
pm2 startup
```

### 4. Setup Nginx Reverse Proxy
```bash
apt install -y nginx

# Create config
cat > /etc/nginx/sites-available/ramdip << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/ramdip /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 5. Setup SSL (HTTPS)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 6. Verify
```bash
# Check application running
pm2 status

# Check Nginx
systemctl status nginx

# Test endpoint
curl https://yourdomain.com/api/blog

# Monitor logs
pm2 logs ramdip
```

---

## 🔍 Post-Deployment Verification

### Essential Checks
```bash
# Test homepage
curl -I https://yourdomain.com

# Test API
curl https://yourdomain.com/api/blog | jq

# Test admin login endpoint
curl -X POST https://yourdomain.com/api/admin/seed

# Seed admin user
curl -X POST https://yourdomain.com/api/admin/seed
```

### Website Checks
- [ ] Homepage loads
- [ ] Blog page accessible
- [ ] Admin panel login working
- [ ] Can create/edit blog posts
- [ ] Images loading properly
- [ ] Mobile responsive
- [ ] SSL certificate valid

---

## 📊 Monitoring Setup

### Uptime Monitoring
1. Go to [UptimeRobot.com](https://uptimerobot.com)
2. Add monitor for `https://yourdomain.com`
3. Set alert email

### Error Tracking (Optional but Recommended)
1. Sign up at [Sentry.io](https://sentry.io)
2. Create project for Next.js
3. Add to your code for error tracking

### Performance Monitoring
- Vercel: Built-in analytics (if using Vercel)
- Google Analytics: Add tracking ID
- Page Speed Insights: https://pagespeed.web.dev/

---

## 🆘 Troubleshooting

### Build Failed
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### MongoDB Connection Error
- Check MONGODB_URI in environment variables
- Verify IP whitelist in MongoDB Atlas
- Test connection locally first

### 502 Bad Gateway (on VPS)
```bash
# Check if app is running
pm2 status

# Restart if needed
pm2 restart ramdip

# Check Nginx logs
tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues
```bash
# Verify certificate
certbot certificates

# Renew if needed
certbot renew --dry-run
```

---

## 🔐 Security Reminders

✅ **Before Production:**
- [ ] Change default admin password
- [ ] Remove test data
- [ ] Enable HTTPS
- [ ] Configure firewall
- [ ] Set up backups
- [ ] Enable database authentication
- [ ] Review environment variables

❌ **Never Do:**
- Don't commit `.env` files
- Don't share secrets on Slack/Email
- Don't use default credentials
- Don't skip HTTPS
- Don't forget backups

---

## 📚 Full Documentation

For detailed information, see:
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `PRODUCTION_CHECKLIST.md` - Pre/post deployment checklist
- `.env.example` - Environment variables template

---

## 💬 Need Help?

1. Check logs: `npm run build` locally first
2. Review environment variables
3. Test MongoDB connection
4. Check firewall/security groups
5. Verify domain DNS records

---

**Ready to deploy?** Start with Vercel - it's the fastest! 🚀

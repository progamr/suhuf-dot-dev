# Deployment Guide

## Overview

This guide covers deploying Suhuf to a Hostinger VPS using Docker and Docker Compose.

## Prerequisites

- Hostinger VPS (Ubuntu 20.04+ or Debian 11+)
- Domain name configured
- SSH access to VPS
- Basic Linux command line knowledge

---

## Server Setup

### 1. Initial Server Configuration

Connect to your VPS:

```bash
ssh root@your-server-ip
```

Update system packages:

```bash
apt update && apt upgrade -y
```

Create a non-root user:

```bash
adduser suhuf
usermod -aG sudo suhuf
su - suhuf
```

### 2. Install Docker

```bash
# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
```

### 3. Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### 4. Install Nginx

```bash
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Configure Firewall

```bash
# Install UFW
sudo apt install -y ufw

# Configure firewall rules
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Application Deployment

### 1. Clone Repository

```bash
cd /home/suhuf
git clone <your-repository-url> suhuf-app
cd suhuf-app
```

### 2. Environment Configuration

Create `.env` file:

```bash
nano .env
```

Add configuration:

```env
# App
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://suhuf:your-secure-password@postgres:5432/suhuf
POSTGRES_USER=suhuf
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=suhuf

# Auth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-32-character-secret-key-here

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com

# News APIs
GUARDIAN_API_KEY=your-guardian-api-key
NEWSAPI_KEY=your-newsapi-key
NYTIMES_API_KEY=your-nytimes-api-key
BBC_API_URL=https://bbc-news-api.vercel.app

# Sync
SYNC_API_KEY=your-sync-api-key-for-cron
```

**Generate secure secrets:**

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate SYNC_API_KEY
openssl rand -hex 32
```

### 3. Build and Start Containers

```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

### 4. Database Setup

```bash
# Run migrations
docker-compose exec app npm run migration:up

# Run initial sync
docker-compose exec app npm run sync:initial
```

---

## Nginx Configuration

### 1. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/suhuf
```

Add configuration:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    return 301 https://$server_name$request_uri;
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;

    # Logging
    access_log /var/log/nginx/suhuf_access.log;
    error_log /var/log/nginx/suhuf_error.log;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Rate limit auth endpoints
    location ~ ^/api/auth/(signup|login) {
        limit_req zone=auth_limit burst=3 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Rate limit API endpoints
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Image optimization
    location /_next/image {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
    }
}
```

### 2. Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/suhuf /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## SSL Certificate (Let's Encrypt)

### 1. Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtain Certificate

```bash
# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose redirect option (2)
```

### 3. Auto-renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up cron job
# Verify with:
sudo systemctl status certbot.timer
```

---

## Monitoring & Maintenance

### 1. Container Management

```bash
# View logs
docker-compose logs -f app
docker-compose logs -f postgres

# Restart containers
docker-compose restart

# Stop containers
docker-compose down

# Start containers
docker-compose up -d

# Rebuild and restart
docker-compose up -d --build
```

### 2. Database Backup

Create backup script:

```bash
nano ~/backup-db.sh
```

Add content:

```bash
#!/bin/bash

BACKUP_DIR="/home/suhuf/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/suhuf_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T postgres pg_dump -U suhuf suhuf > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Delete backups older than 7 days
find $BACKUP_DIR -name "suhuf_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

Make executable:

```bash
chmod +x ~/backup-db.sh
```

Schedule daily backup:

```bash
crontab -e
```

Add line:

```cron
0 2 * * * /home/suhuf/backup-db.sh >> /home/suhuf/backup.log 2>&1
```

### 3. Application Updates

```bash
# Pull latest code
cd /home/suhuf/suhuf-app
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Run migrations (if any)
docker-compose exec app npm run migration:up
```

### 4. Log Rotation

Create logrotate configuration:

```bash
sudo nano /etc/logrotate.d/suhuf
```

Add content:

```
/var/log/nginx/suhuf_*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

### 5. Monitoring Setup

Install monitoring tools:

```bash
# Install htop
sudo apt install -y htop

# Install ncdu (disk usage)
sudo apt install -y ncdu

# Check disk space
df -h

# Check memory usage
free -h

# Check Docker stats
docker stats
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
docker-compose logs app

# Check environment variables
docker-compose exec app printenv

# Verify database connection
docker-compose exec app npm run db:check
```

### Database Connection Issues

```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Connect to database
docker-compose exec postgres psql -U suhuf -d suhuf

# Check database status
docker-compose exec postgres pg_isready
```

### Nginx Issues

```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/suhuf_error.log
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check certificate expiry
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### High Memory Usage

```bash
# Check container memory
docker stats

# Restart containers
docker-compose restart

# Clear Docker cache
docker system prune -a
```

---

## Performance Optimization

### 1. Enable Gzip Compression

Add to Nginx configuration:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### 2. Database Optimization

```sql
-- Connect to database
docker-compose exec postgres psql -U suhuf -d suhuf

-- Analyze tables
ANALYZE;

-- Vacuum database
VACUUM ANALYZE;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan;
```

### 3. Docker Resource Limits

Edit `docker-compose.yml`:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

---

## Security Hardening

### 1. SSH Security

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Disable root login
PermitRootLogin no

# Disable password authentication (use SSH keys)
PasswordAuthentication no

# Restart SSH
sudo systemctl restart sshd
```

### 2. Fail2Ban

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Configure
sudo nano /etc/fail2ban/jail.local
```

Add configuration:

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true
```

Start Fail2Ban:

```bash
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 3. Automatic Security Updates

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## Rollback Procedure

If deployment fails:

```bash
# Stop containers
docker-compose down

# Restore previous version
git checkout <previous-commit>

# Rebuild
docker-compose up -d --build

# Restore database (if needed)
gunzip -c /home/suhuf/backups/suhuf_YYYYMMDD.sql.gz | docker-compose exec -T postgres psql -U suhuf -d suhuf
```

---

## Scaling Considerations

### Horizontal Scaling (Future)

1. **Load Balancer**: Add Nginx load balancer
2. **Multiple App Instances**: Run multiple Next.js containers
3. **Database Replication**: PostgreSQL read replicas
4. **Redis Cache**: Add Redis for session storage
5. **CDN**: Use Cloudflare or similar

### Vertical Scaling

Upgrade VPS resources:
- More CPU cores
- More RAM
- Faster SSD storage

---

## Checklist

### Pre-deployment

- [ ] Domain DNS configured
- [ ] VPS provisioned and accessible
- [ ] Docker and Docker Compose installed
- [ ] Nginx installed and configured
- [ ] SSL certificate obtained
- [ ] Environment variables configured
- [ ] Firewall rules configured

### Post-deployment

- [ ] Application accessible via HTTPS
- [ ] Database migrations completed
- [ ] Initial sync completed
- [ ] Backups scheduled
- [ ] Monitoring configured
- [ ] Logs rotating properly
- [ ] SSL auto-renewal working

---

## Support

For deployment issues:
1. Check application logs
2. Check Nginx logs
3. Check Docker logs
4. Review this documentation
5. Contact support if needed

---

## Conclusion

This deployment guide provides a production-ready setup for Suhuf on Hostinger VPS with Docker, ensuring security, performance, and maintainability.

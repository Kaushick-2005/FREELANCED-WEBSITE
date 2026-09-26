# 💎 RAMEEZ JEWELLERZ — Deployment Guide

## Option 1: Vercel (Recommended — Free & Easiest)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Rameez Jewellerz website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rameez-jewellerz.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Sign in to Vercel using your GitHub account.
2. Click **Add New Project**.
3. Import the `rameez-jewellerz` repository.
4. Configure the project:

| Setting          | Value           |
| ---------------- | --------------- |
| Framework Preset | Next.js         |
| Build Command    | `npm run build` |
| Output Directory | `.next`         |

5. Add the following Environment Variable:

```env
DATABASE_URL=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/rameez-jewellerz?retryWrites=true&w=majority
```

6. Click **Deploy**.
7. Wait 2–3 minutes for deployment to complete.

Your website will be available at:

```text
https://rameez-jewellerz.vercel.app
```

---

## Option 2: Netlify (Free)

### Step 1: Push to GitHub

Follow the same Git commands shown above.

### Step 2: Deploy on Netlify

1. Sign in to Netlify.
2. Click **Add New Site → Import an Existing Project**.
3. Connect GitHub and select your repository.
4. Configure:

| Setting           | Value           |
| ----------------- | --------------- |
| Build Command     | `npm run build` |
| Publish Directory | `.next`         |

5. Add Environment Variable:

```env
DATABASE_URL=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/rameez-jewellerz?retryWrites=true&w=majority
```

6. Click **Deploy Site**.

---

## Option 3: Self-Hosted (VPS / Dedicated Server)

### Prerequisites

* Node.js 18+
* Git installed
* Domain name (optional)

### Deployment Steps

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/rameez-jewellerz.git

# Move into project
cd rameez-jewellerz

# Install dependencies
npm install

# Create environment file
touch .env

# Add database URL inside .env
DATABASE_URL=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/rameez-jewellerz?retryWrites=true&w=majority

# Generate Prisma Client
npm run db:generate

# Push schema to MongoDB
npm run db:push

# Build application
npm run build

# Start production server
npm run start
```

Application will run on:

```text
http://YOUR_SERVER_IP:3000
```

### Run Continuously Using PM2

```bash
npm install -g pm2

pm2 start npm --name "rameez-jewellerz" -- start

pm2 save

pm2 startup
```

---

## Option 4: Local Network Testing

Run:

```bash
npm run build
npm run start -- -H 0.0.0.0
```

Access from other devices on the same network:

```text
http://YOUR_PC_IP:3000
```

---

# Post-Deployment Checklist

## 1. MongoDB Atlas Network Access

1. Open MongoDB Atlas.
2. Navigate to **Network Access**.
3. Click **Add IP Address**.
4. Select **Allow Access From Anywhere (0.0.0.0/0)**.
5. Save changes.

This allows your deployed application to connect to MongoDB.

---

## 2. Secure the Admin Panel

Locate:

```text
src/app/admin/page.tsx
```

Replace the default admin password with a strong password and redeploy.

---

## 3. Update Business Information

Update the following details throughout the project:

* Store Name
* Phone Number
* Email Address
* Store Address
* Social Media Links
* WhatsApp Number

After making changes:

```bash
git add .
git commit -m "Updated business information"
git push
```

Vercel/Netlify will automatically redeploy.

---

## 4. Configure a Custom Domain (Optional)

### Vercel

1. Open Project Dashboard.
2. Navigate to **Settings → Domains**.
3. Add your domain.

Example:

```text
rameezjewellerz.com
```

4. Update DNS records as instructed.
5. SSL certificate will be generated automatically.

---

# Admin Panel

After deployment, the admin dashboard can be accessed at:

```text
https://your-domain.com/admin
```

or

```text
https://rameez-jewellerz.vercel.app/admin
```

---

# Useful Commands

| Command               | Description                    |
| --------------------- | ------------------------------ |
| `npm run dev`         | Start development server       |
| `npm run build`       | Build production version       |
| `npm run start`       | Start production server        |
| `npm run lint`        | Check code quality             |
| `npm run db:generate` | Generate Prisma Client         |
| `npm run db:push`     | Push schema changes to MongoDB |

---

# Production Notes

* Never commit `.env` files to GitHub.
* Use Environment Variables in Vercel/Netlify.
* Regularly backup your MongoDB database.
* Change default admin credentials before going live.
* Enable HTTPS using Vercel or your hosting provider.

---

## Live Website

```text
https://rameez-jewellerz.vercel.app
```

## Admin Dashboard

```text
https://rameez-jewellerz.vercel.app/admin
```

© 2026 RAMEEZ JEWELLERZ. All Rights Reserved.

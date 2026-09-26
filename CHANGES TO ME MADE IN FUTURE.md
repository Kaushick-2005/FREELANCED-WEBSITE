# RAMEEZ JEWELLERZ — Luxury Jewellery E-Commerce Website

A premium full-stack luxury jewellery e-commerce website built with Next.js, React, TypeScript, Tailwind CSS, and MongoDB Atlas.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- MongoDB Atlas account (already configured)

### Installation

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

Open **http://localhost:3000** in your browser.

### Admin Panel

- URL: **http://localhost:3000/admin**
- Username: `rameez_admin`
- Password: `Ramez@2026`

---

## 📁 Project Structure

```
rameez-jewellerz/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin login & dashboard pages
│   │   │   ├── page.tsx        # Admin login (/admin)
│   │   │   └── dashboard/      # Admin dashboard (/admin/dashboard)
│   │   ├── api/                # Backend API routes
│   │   │   ├── auth/           # User auth (register, login, update-profile)
│   │   │   ├── products/       # Product CRUD
│   │   │   ├── orders/         # Order management
│   │   │   ├── custom-quote/   # Custom jewellery quotes
│   │   │   ├── contact/        # Contact form messages
│   │   │   ├── offers/         # Special offers CRUD
│   │   │   ├── reviews/        # Product reviews
│   │   │   ├── gallery/        # Shop gallery images
│   │   │   ├── coupons/        # Discount coupons
│   │   │   └── gold-rate/      # Live gold/silver rates
│   │   ├── layout.tsx          # Root layout (fonts, metadata, favicon)
│   │   ├── page.tsx            # Main homepage (all sections)
│   │   └── globals.css         # Global styles & luxury theme
│   ├── components/
│   │   ├── luxury/             # Core UI components
│   │   └── sections/           # Homepage sections (Hero, About, etc.)
│   └── lib/
│       ├── db.ts               # MongoDB connection
│       ├── store.ts            # Zustand state management
│       ├── invoice.ts          # PDF invoice generator
│       ├── i18n.ts             # Tamil/English translations
│       ├── seed-data.ts        # Initial product data
│       └── types.ts            # TypeScript types
├── public/
│   ├── products/               # Jewellery product images
│   ├── rz-logo.png             # Company logo
│   └── robots.txt
├── prisma/
│   └── schema.prisma           # MongoDB database schema
├── scripts/
│   └── cleanup-db.js           # One-time DB cleanup script
└── .env                        # MongoDB connection string
```

---

## ✏️ HOW TO UPDATE CONTENT (For Non-Developers)

### 1. 📞 Phone Number

**Location:** `src/lib/i18n.ts` (line ~9)

```typescript
// Change these phone numbers everywhere:
```

Also update in these files:

- `src/components/luxury/footer.tsx` — search for `90000 00000`
- `src/components/luxury/whatsapp-button.tsx` — search for `919000000000` (WhatsApp number, no + or spaces)
- `src/components/sections/contact.tsx` — search for `90000 00000`
- `src/components/sections/hero.tsx` — search for `919000000000`

### 2. 📧 Email Address

**Location:** `src/components/luxury/footer.tsx` — search for `care@rameezjewellerz.com`

Also in:

- `src/components/sections/contact.tsx` — search for `care@rameezjewellerz.com`

### 3. 📍 Address / Location

**Location:** `src/lib/i18n.ts` — search for `Valliyur, Tirunelveli`

Also in:

- `src/components/luxury/footer.tsx` — search for `Valliyur`
- `src/components/sections/contact.tsx` — search for `Valliyur`
- `src/components/sections/hero.tsx` — search for `Valliyur`
- Google Map iframe: `src/components/sections/contact.tsx` — search for `maps.google.com`

### 4. 📱 WhatsApp Number

**Location:** `src/components/luxury/whatsapp-button.tsx`

```typescript
const WHATSAPP = "919000000000"; // Change this (country code + number, no + or spaces)
```

Also in:

- `src/components/luxury/footer.tsx` — search for `WHATSAPP`
- `src/components/sections/hero.tsx` — search for `WHATSAPP`

### 5. 📸 Instagram URL

**Location:** `src/components/luxury/footer.tsx`

```typescript
{ icon: Instagram, href: 'https://instagram.com', ... }
// Change 'https://instagram.com' to your Instagram profile URL
```

### 6. 🎥 Video (YouTube / Instagram / Custom Video)

Currently a YouTube video is embedded in the Gallery section.

**Location:** `src/components/sections/gallery.tsx` — search for `youtube.com/embed`

#### To change the YouTube video:

```typescript
src = "https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1";
// Replace VIDEO_ID with your YouTube video ID (from the URL)
```

#### To use a different video platform:

**For Instagram Reel/Video:**

```typescript
// Replace the iframe src with:
src = "https://www.instagram.com/reel/REEL_ID/embed";
```

**For a normal video file (MP4) hosted on your server:**

```typescript
// Replace the <iframe> with a <video> tag:
<video
  className="absolute inset-0 h-full w-full"
  controls
  autoPlay
  muted
  loop
>
  <source src="/videos/gold-making.mp4" type="video/mp4" />
</video>
// Put your video file in: public/videos/gold-making.mp4
```

**For a Vimeo video:**

```typescript
src = "https://player.vimeo.com/video/VIDEO_ID";
```

**For a self-hosted video from any URL:**

```typescript
<video className="absolute inset-0 h-full w-full" controls>
  <source src="https://your-website.com/video.mp4" type="video/mp4" />
</video>
```

### 7. 🏪 Business Hours

**Location:** `src/components/luxury/footer.tsx` — search for `9:30 AM`

Also in:

- `src/components/sections/contact.tsx` — search for `9:30 AM`

### 8. 💰 Gold & Silver Rates

The rates are simulated with realistic values.

**Location:** `src/app/api/gold-rate/route.ts`

```typescript
const BASE_RATES = {
  gold24k: 75200, // per 10g (24K) — change this
  gold22k: 68900, // per 10g (22K)
  silver: 96500, // per kg
  roseGold: 71500, // per 10g
};
```

For **real live rates**, integrate an API like [GoldAPI.io](https://goldapi.io) or [Metals-API](https://metals-api.com):

1. Sign up and get an API key
2. Replace the `GET` function in `src/app/api/gold-rate/route.ts` with a fetch call to the API

### 9. 🎨 Colors / Theme

**Location:** `src/app/globals.css`

```css
--gold: #d4af37; /* Main gold color */
--gold-light: #f5e6a8; /* Light gold */
--gold-dark: #b8860b; /* Dark gold */
--rosegold: #c08a96; /* Rose gold */
--silver: #d4d4d4; /* Silver */
--royal: #050505; /* Royal black background */
```

### 10. 🔐 Admin Credentials

**Location:** `src/app/admin/page.tsx` (line ~34)

```typescript
if (username === 'rameez_admin' && password === 'Ramez@2026') {
// Change username and password here
```

### 11. 📝 Tagline

**Location:** `src/lib/i18n.ts`

```typescript
heroSubtitle: 'Radiant Beauty, Enduring Value',  // English
// Tamil: 'ஒளிரும் அழகு, நிலைக்கும் மதிப்பு'
```

Also in footer: `src/components/luxury/footer.tsx` — search for `Radiant Beauty`

---

## 🗄️ Database (MongoDB Atlas)

### Connection

**File:** `.env`

```
DATABASE_URL=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/rameez-jewellerz?retryWrites=true&w=majority
```

**Also hardcoded in:** `src/lib/db.ts` (as fallback)

### Collections (10)

| Collection     | Purpose                                                |
| -------------- | ------------------------------------------------------ |
| User           | User accounts (name, email, phone, password, address)  |
| Product        | Jewellery products (name, price, images, stock, flags) |
| Order          | Booked orders (items as JSON, status, user details)    |
| Review         | Product reviews (admin-added)                          |
| Offer          | Special offers (admin-managed)                         |
| Coupon         | Discount coupons                                       |
| ContactMessage | Contact form submissions                               |
| CustomQuote    | Custom jewellery requests (images as Base64 in DB)     |
| GalleryImage   | Shop gallery images (admin-managed)                    |

### One-Time Cleanup

Delete unused collections:

```bash
node scripts/cleanup-db.js
```

---

## 🛠️ Admin Dashboard Features

Access at `/admin` — manage:

- **Products**: Add, edit, delete, toggle flags (New/Hot/Featured/Offer), upload multiple images
- **Offers**: Create, edit, delete special offers
- **Reviews**: Add reviews linked to products (based on real customer purchases)
- **Orders**: View all orders with items, update status (Pending → Confirmed → Completed → Cancelled)
- **Customers**: View all customers with order count and total spent
- **Custom Quotes**: View custom jewellery requests with uploaded design images/PDFs
- **Gallery**: Upload/delete shop gallery images
- **Messages**: View contact form submissions

All tabs have **search functionality**.

---

## 👤 User Features

- **Registration & Login**: Email + password (stored in MongoDB)
- **Profile**: Update name, email, phone, address, city, pincode, password
- **Cart & Wishlist**: Stored in browser (localStorage)
- **Book Order**: Checkout with auto-filled address from profile
- **My Orders**: View order history with status (Pending/Confirmed/Completed/Cancelled)
- **Custom Quotes**: Request custom jewellery with image/PDF uploads (stored in DB as Base64)
- **Invoice Download**: PDF invoice for orders and custom quotes (includes status)

---

## 📜 Available Commands

| Command               | Description                                     |
| --------------------- | ----------------------------------------------- |
| `npm run dev`         | Start development server (port 3000)            |
| `npm run build`       | Build for production                            |
| `npm run start`       | Start production server                         |
| `npm run lint`        | Check code quality                              |
| `npm run db:generate` | Regenerate Prisma client (after schema changes) |
| `npm run db:push`     | Push schema changes to MongoDB                  |

---

## 🌐 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add environment variable: `DATABASE_URL` = your MongoDB connection string
4. Deploy

### Deploy to other platforms

```bash
npm run build
npm run start
```

---

## 📞 Support

For any questions about this website, contact the developer.

**Rameez Jewellerz** — Valliyur, Tirunelveli · Since 1991

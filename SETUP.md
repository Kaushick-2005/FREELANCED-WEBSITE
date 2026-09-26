# Rameez Jewellerz — Local Setup Guide (Windows / Node.js)

## Prerequisites

- **Node.js 18+** installed (check: `node -v`)
- **npm** installed (check: `npm -v`)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

The `.env` file is already set with your MongoDB Atlas URI:

```
DATABASE_URL=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/rameez-jewellerz?retryWrites=true&w=majority
```

## Step 3: Generate Prisma Client & Push Schema to MongoDB

```bash
npm run db:generate
npm run db:push
```

## Step 4: (ONE TIME ONLY) Clean Up Unused Collections

Delete the 9 unused/duplicate collections from MongoDB:

```bash
node scripts/cleanup-db.js
```

## Step 5: Start the Development Server

```bash
npm run dev
```

Then open: **http://localhost:3000**

---

## Admin Panel Access

- URL: **http://localhost:3000/admin**
- Username: `rameez_admin`
- Password: `Ramez@2026`

## MongoDB Collections (10 — only what's needed)

| Collection     | Purpose                                      |
| -------------- | -------------------------------------------- |
| User           | User accounts (login, registration, profile) |
| Product        | Jewellery products (catalog)                 |
| Order          | Booked orders (checkout)                     |
| OrderItem      | Items within each order                      |
| Review         | Product reviews (admin-added)                |
| Offer          | Special offers (admin-managed)               |
| Coupon         | Discount coupons                             |
| ContactMessage | Contact form submissions                     |
| CustomQuote    | Custom jewellery requests                    |
| GalleryImage   | Shop gallery images                          |

## Useful Commands

| Command               | What it does                                    |
| --------------------- | ----------------------------------------------- |
| `npm run dev`         | Start dev server on port 3000                   |
| `npm run build`       | Build for production                            |
| `npm run start`       | Start production server                         |
| `npm run lint`        | Check code quality                              |
| `npm run db:generate` | Regenerate Prisma client (after schema changes) |
| `npm run db:push`     | Push schema changes to MongoDB                  |

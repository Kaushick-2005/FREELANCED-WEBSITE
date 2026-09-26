// Run this ONCE to delete unused collections from MongoDB Atlas
// Command: node scripts/cleanup-db.js
/* eslint-disable @typescript-eslint/no-require-imports */

const { MongoClient } = require('mongodb');

const URI = process.env.DATABASE_URL;

if (!URI) {
  throw new Error('DATABASE_URL is required');
}

// Collections to DELETE (unused or duplicates)
const TO_DELETE = [
  'Otp',              // OTP removed — registration is direct now
  'CartItem',         // Cart stored in browser localStorage, not DB
  'WishlistItem',     // Wishlist stored in browser localStorage, not DB
  'Appointment',      // Never implemented
  'CustomMaterial',   // Never implemented
  'orders',           // Duplicate (Prisma uses 'Order')
  'products',         // Duplicate (Prisma uses 'Product')
  'reviews',          // Duplicate (Prisma uses 'Review')
  'users',            // Duplicate (Prisma uses 'User')
];

// Collections to KEEP (used by the website)
const TO_KEEP = [
  'User',             // User accounts
  'Product',          // Jewellery products
  'Order',            // Booked orders
  'OrderItem',        // Items in each order
  'Review',           // Product reviews
  'Offer',            // Special offers
  'Coupon',           // Discount coupons
  'ContactMessage',   // Contact form messages
  'CustomQuote',      // Custom jewellery requests
  'GalleryImage',     // Shop gallery images
];

async function main() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db('rameez-jewellerz');

  console.log('=== Collections BEFORE cleanup ===');
  const before = await db.listCollections().toArray();
  before.forEach(c => console.log('  -', c.name));

  console.log('\n=== Deleting unused collections ===');
  for (const name of TO_DELETE) {
    try {
      const exists = before.find(c => c.name === name);
      if (exists) {
        await db.collection(name).drop();
        console.log(`  ✓ Dropped: ${name}`);
      } else {
        console.log(`  - Skipped (not found): ${name}`);
      }
    } catch (e) {
      console.log(`  ✗ Error dropping ${name}: ${e.message}`);
    }
  }

  console.log('\n=== Collections AFTER cleanup (KEPT) ===');
  const after = await db.listCollections().toArray();
  after.forEach(c => console.log('  -', c.name));

  console.log(`\nTotal: ${after.length} collections remaining`);
  await client.close();
}

main().catch(console.error);

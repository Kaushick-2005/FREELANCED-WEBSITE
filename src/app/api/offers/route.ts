import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const SEED_OFFERS = [
  { title: 'Wedding Offer', titleTa: 'திருமண சலுகை', description: 'Up to 25% off on making charges for bridal sets', descriptionTa: 'திருமண நகைகளில் 25% மேக்கிங் சார்ஜ் தள்ளுபடி', discountLabel: '25% OFF', offerType: 'percent', discountValue: 25, icon: 'Crown', order: 1 },
  { title: 'Festival Offer', titleTa: 'திருவிழா சலுகை', description: 'Special festive pricing on all gold jewellery', descriptionTa: 'திருவிழா கால சிறப்பு விலையில் தங்க நகைகள்', discountLabel: '15% OFF', offerType: 'percent', discountValue: 15, icon: 'Sparkles', order: 2 },
  { title: 'Making Charge Discount', titleTa: 'மேக்கிங் சார்ஜ் தள்ளுபடி', description: 'Minimum making charges on all jewellery', descriptionTa: 'அனைத்து நகைகளிலும் குறைந்தபட்ச மேக்கிங் சார்ஜ்', discountLabel: '0% Making', offerType: 'making', discountValue: 0, icon: 'Percent', order: 3 },
  { title: 'Gold Coin Offer', titleTa: 'தங்க நாணய சலுகை', description: 'Special price on 24K gold coins', descriptionTa: 'தங்க நாணயங்களில் சிறப்பு விலை', discountLabel: 'Best Rate', offerType: 'coin', discountValue: 0, icon: 'Coins', order: 4 },
  { title: 'Silver Coin Offer', titleTa: 'வெள்ளி நாணய சலுகை', description: 'Free gift on silver coin purchases', descriptionTa: 'வெள்ளி நாணயங்களில் இலவச பரிசு', discountLabel: 'Free Gift', offerType: 'gift', discountValue: 0, icon: 'Gift', order: 5 },
];

async function ensureOffers() {
  try {
    const count = await db.offer.count();
    if (count === 0) {
      await db.offer.createMany({ data: SEED_OFFERS as any });
    }
  } catch { /* ignore */ }
}

export async function GET() {
  await ensureOffers();
  try {
    const offers = await db.offer.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ offers });
  } catch {
    return NextResponse.json({ offers: SEED_OFFERS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, ...data } = body;

    if (action === 'create') {
      const offer = await db.offer.create({ data: { ...data, active: data.active ?? true } });
      return NextResponse.json({ success: true, offer });
    }
    if (action === 'update' && id) {
      const offer = await db.offer.update({ where: { id }, data });
      return NextResponse.json({ success: true, offer });
    }
    if (action === 'delete' && id) {
      await db.offer.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

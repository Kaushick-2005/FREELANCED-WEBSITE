import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const SEED_GALLERY = [
  { label: 'Gold Necklace', labelTa: 'தங்க நெக்லஸ்', category: 'Gold', image: '/products/gold-necklace-1.png', order: 1 },
  { label: 'Silver Necklace', labelTa: 'வெள்ளி நெக்லஸ்', category: 'Silver', image: '/products/silver-necklace.png', order: 2 },
  { label: 'Bridal Set', labelTa: 'மணமகள் செட்', category: 'Bridal', image: '/products/bridal-set.png', order: 3 },
  { label: 'Gold Bangles', labelTa: 'தங்க வளையல்', category: 'Bangles', image: '/products/gold-bangles.png', order: 4 },
  { label: 'Gold Ring', labelTa: 'தங்க மோதிரம்', category: 'Rings', image: '/products/gold-ring-diamond.png', order: 5 },
  { label: 'Temple Jewellery', labelTa: 'கோயில் நகை', category: 'Temple', image: '/products/temple-necklace.png', order: 6 },
  { label: 'Boutique Display', labelTa: 'கடை காட்சி', category: 'Gold', image: '/products/gallery-1.png', order: 7 },
  { label: 'Bridal Showcase', labelTa: 'மணமகள் காட்சி', category: 'Bridal', image: '/products/gallery-2.png', order: 8 },
];

async function ensureSeeded() {
  try {
    const count = await db.galleryImage.count();
    if (count === 0) {
      await db.galleryImage.createMany({ data: SEED_GALLERY as any });
    }
  } catch { /* ignore */ }
}

export async function GET() {
  await ensureSeeded();
  try {
    const images = await db.galleryImage.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: SEED_GALLERY });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'create') {
      const img = await db.galleryImage.create({ data: { label: body.label, labelTa: body.labelTa || '', category: body.category, image: body.image, order: body.order || 0 } });
      return NextResponse.json({ success: true, image: img });
    }
    if (body.action === 'update' && body.id) {
      const img = await db.galleryImage.update({ where: { id: body.id }, data: { label: body.label, labelTa: body.labelTa, category: body.category, image: body.image, active: body.active } });
      return NextResponse.json({ success: true, image: img });
    }
    if (body.action === 'delete' && body.id) {
      await db.galleryImage.delete({ where: { id: body.id } });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SEED_PRODUCTS } from '@/lib/seed-data';
import type { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function ensureSeeded() {
  try {
    const count = await db.product.count();
    if (count === 0) {
      await db.product.createMany({
        data: SEED_PRODUCTS.map((p) => ({
          ...p,
          images: JSON.stringify(p.images),
          tags: JSON.stringify(p.tags),
        })),
      });
    }
  } catch (e) {
    // If DB not ready, fallback handled by caller
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const material = searchParams.get('material');
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const isNew = searchParams.get('new');
  const best = searchParams.get('best');
  const q = searchParams.get('q');
  const limit = searchParams.get('limit');

  let products: Product[] = [];

  try {
    await ensureSeeded();
    const where: any = {};
    if (material) where.material = material;
    if (category) where.category = category;
    if (featured === 'true') where.isFeatured = true;
    if (isNew === 'true') where.isNew = true;
    if (best === 'true') where.isBestSeller = true;
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { nameTa: { contains: q } },
        { category: { contains: q } },
        { material: { contains: q } },
      ];
    }

    const rows = await db.product.findMany({
      where,
      take: limit ? Number(limit) : undefined,
      orderBy: { createdAt: 'asc' },
    });

    products = rows.map((r) => ({
      ...r,
      images: safeParse(r.images, []),
      tags: safeParse(r.tags, []),
    })) as Product[];
  } catch {
    products = SEED_PRODUCTS.map((p, i) => ({ ...p, id: `seed-${i}` }));
    if (material) products = products.filter((p) => p.material === material);
    if (category) products = products.filter((p) => p.category === category);
    if (featured === 'true') products = products.filter((p) => p.isFeatured);
    if (isNew === 'true') products = products.filter((p) => p.isNew);
    if (best === 'true') products = products.filter((p) => p.isBestSeller);
    if (q) {
      const ql = q.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(ql) ||
          p.category.toLowerCase().includes(ql) ||
          p.material.toLowerCase().includes(ql)
      );
    }
    if (limit) products = products.slice(0, Number(limit));
  }

  return NextResponse.json({ products, count: products.length });
}

// Admin CRUD
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, ...data } = body;

    if (action === 'create') {
      const product = await db.product.create({
        data: {
          ...data,
          images: JSON.stringify(data.images || [data.image]),
          tags: JSON.stringify(data.tags || []),
          slug: data.slug || slugify(data.name),
        },
      });
      return NextResponse.json({ success: true, product });
    }

    if (action === 'update' && id) {
      const updateData: any = { ...data };
      if (data.images) updateData.images = JSON.stringify(data.images);
      if (data.tags) updateData.tags = JSON.stringify(data.tags);
      const product = await db.product.update({ where: { id }, data: updateData });
      return NextResponse.json({ success: true, product });
    }

    if (action === 'delete' && id) {
      await db.product.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function safeParse(s: string, fallback: any) {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
}

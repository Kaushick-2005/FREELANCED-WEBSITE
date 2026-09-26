import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const SEED_COUPONS = [
  { code: 'RAMEEZ10', type: 'percent', value: 10, minOrder: 10000 },
  { code: 'WEDDING25', type: 'percent', value: 25, minOrder: 100000 },
  { code: 'FESTIVE15', type: 'percent', value: 15, minOrder: 25000 },
  { code: 'FLAT5000', type: 'flat', value: 5000, minOrder: 50000 },
];

async function ensureCoupons() {
  try {
    const count = await db.coupon.count();
    if (count === 0) {
      await db.coupon.createMany({ data: SEED_COUPONS as any });
    }
  } catch {
    /* ignore */
  }
}

export async function GET() {
  await ensureCoupons();
  try {
    const coupons = await db.coupon.findMany({ where: { active: true } });
    return NextResponse.json({ coupons });
  } catch {
    return NextResponse.json({ coupons: SEED_COUPONS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    await ensureCoupons();
    let coupon: any = null;
    try {
      coupon = await db.coupon.findFirst({ where: { code: code.toUpperCase(), active: true } });
    } catch {
      coupon = SEED_COUPONS.find((c) => c.code === code.toUpperCase());
    }

    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid coupon code' });
    }
    if (subtotal < coupon.minOrder) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order ₹${coupon.minOrder.toLocaleString('en-IN')} required`,
      });
    }

    const discount =
      coupon.type === 'percent'
        ? Math.round((subtotal * coupon.value) / 100)
        : coupon.value;

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

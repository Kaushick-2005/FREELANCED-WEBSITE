import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Generate order ID in format: username-001 (e.g., kaushick-001)
async function generateOrderId(customerName: string): Promise<string> {
  const baseName = (customerName || 'user')
    .toLowerCase()
    .trim()
    .split(/\s+/)[0] // take first name only
    .replace(/[^a-z0-9]/g, ''); // remove special chars

  // Count existing orders by this user to determine sequence
  const existing = await db.order.findMany({
    where: { customerName: { contains: customerName, mode: 'insensitive' } },
    select: { id: true },
  });

  // Find the max sequence number from existing orders
  let maxSeq = 0;
  for (const o of existing) {
    const match = o.id.match(/-(\d+)$/);
    if (match) {
      const seq = parseInt(match[1], 10);
      if (seq > maxSeq) maxSeq = seq;
    }
  }

  const seq = maxSeq + 1;
  return `${baseName}-${String(seq).padStart(3, '0')}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Admin update action
    if (body.action === 'update' && body.id) {
      try {
        const order = await db.order.update({ where: { id: body.id }, data: { status: body.status } });
        return NextResponse.json({ success: true, order });
      } catch {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
    }

    const {
      userId,
      customerName,
      phone,
      email,
      address,
      city,
      pincode,
      paymentMethod,
      items,
      subtotal,
      makingCharge,
      discount,
      total,
      couponCode,
    } = body;

    if (!customerName || !phone || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate custom order ID
    const customId = await generateOrderId(customerName);

    // Store items as JSON string
    const order = await db.order.create({
      data: {
        id: customId,
        sessionId: 'guest',
        userId: userId || null,
        customerName,
        phone,
        email: email || '',
        address: address || '',
        city: city || '',
        pincode: pincode || '',
        paymentMethod: paymentMethod || 'Book Order',
        status: 'Pending',
        subtotal: Number(subtotal) || 0,
        makingCharge: Number(makingCharge) || 0,
        discount: Number(discount) || 0,
        total: Number(total) || 0,
        couponCode: couponCode || null,
        items: JSON.stringify(items),
      },
    });

    // Auto-reduce stock for each ordered product
    for (const item of items) {
      if (item.productId) {
        try {
          const product = await db.product.findUnique({ where: { id: item.productId } });
          if (product) {
            const newStock = Math.max(0, product.stock - (Number(item.quantity) || 1));
            await db.product.update({
              where: { id: item.productId },
              data: { stock: newStock },
            });
          }
        } catch { /* skip if product not found */ }
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');
  const q = searchParams.get('q'); // search query for admin

  try {
    let where: any = {};

    if (phone) {
      where.phone = phone;
    } else if (q) {
      // Admin search: by order ID, customer name, or phone
      where.OR = [
        { id: { contains: q, mode: 'insensitive' } },
        { customerName: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ];
    }

    const orders = await db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const parsed = orders.map((o: any) => ({
      ...o,
      items: safeParse(o.items, []),
    }));

    return NextResponse.json({ orders: parsed });
  } catch (e: any) {
    return NextResponse.json({ orders: [] });
  }
}

function safeParse(s: string, fallback: any) {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

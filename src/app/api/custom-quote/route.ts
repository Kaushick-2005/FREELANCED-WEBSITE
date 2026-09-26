import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');
  const q = searchParams.get('q'); // search query for admin

  try {
    let where: any = {};

    if (phone) {
      where.phone = phone;
    } else if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { material: { contains: q, mode: 'insensitive' } },
      ];
    }

    const quotes = await db.customQuote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ quotes });
  } catch {
    return NextResponse.json({ quotes: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Admin update action
    if (body.action === 'update' && body.id) {
      try {
        const quote = await db.customQuote.update({ where: { id: body.id }, data: { status: body.status } });
        return NextResponse.json({ success: true, quote });
      } catch {
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
      }
    }

    const { userId, name, phone, email, address, material, budget, description, images } = body;
    if (!name || !phone || !material || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate quote ID in format: username-Q001
    const baseName = name.toLowerCase().trim().split(/\s+/)[0].replace(/[^a-z0-9]/g, '');
    const existing = await db.customQuote.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
      select: { id: true },
    });
    let maxSeq = 0;
    for (const q of existing) {
      const match = q.id.match(/-Q(\d+)$/);
      if (match) {
        const seq = parseInt(match[1], 10);
        if (seq > maxSeq) maxSeq = seq;
      }
    }
    const quoteId = `${baseName}-Q${String(maxSeq + 1).padStart(3, '0')}`;

    // Store images as JSON string (support multiple files)
    const imageData = images && images.length > 0 ? JSON.stringify(images) : null;

    const quote = await db.customQuote.create({
      data: {
        id: quoteId,
        name,
        phone,
        email: email || '',
        material,
        budget: Number(budget) || 0,
        description: description + (address ? `\n\nAddress: ${address}` : ''),
        image: imageData,
        status: 'Pending',
      },
    });

    return NextResponse.json({ success: true, quote });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

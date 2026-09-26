import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Admin delete action
    if (body.action === 'delete' && body.id) {
      await db.contactMessage.delete({ where: { id: body.id } });
      return NextResponse.json({ success: true });
    }

    const { name, phone, email, message } = body;
    if (!name || !phone || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const msg = await db.contactMessage.create({
      data: { name, phone, email: email || '', message },
    });

    return NextResponse.json({ success: true, message: msg });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

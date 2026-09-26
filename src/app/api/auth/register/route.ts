import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check duplicate email
    const existingEmail = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingEmail) {
      return NextResponse.json({
        error: 'already_used',
        message: 'This email is already registered with another account. Please use a different email or login.',
      }, { status: 409 });
    }

    // Check duplicate phone
    const existingPhone = await db.user.findUnique({ where: { phone } });
    if (existingPhone) {
      return NextResponse.json({
        error: 'already_used',
        message: 'This phone number is already registered. Please use a different number or login.',
      }, { status: 409 });
    }

    // Create user directly (no OTP)
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        password,
        isVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

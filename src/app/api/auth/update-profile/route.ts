import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, phone, email, address, city, pincode, newPassword } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if email is being changed and if it's already taken
    if (email) {
      const existing = await db.user.findFirst({
        where: { email: email.toLowerCase(), NOT: { id: userId } },
      });
      if (existing) {
        return NextResponse.json({
          error: 'already_used',
          message: 'This email is already used by another account.',
        }, { status: 409 });
      }
    }

    // Check if phone is being changed and if it's already taken
    if (phone) {
      const existing = await db.user.findFirst({
        where: { phone, NOT: { id: userId } },
      });
      if (existing) {
        return NextResponse.json({
          error: 'already_used',
          message: 'This phone number is already used by another account.',
        }, { status: 409 });
      }
    }

    // Build update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (pincode !== undefined) updateData.pincode = pincode;
    if (newPassword) updateData.password = newPassword;

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

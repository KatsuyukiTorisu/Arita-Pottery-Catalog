import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';
import { generateMembershipId, generateToken } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  password: z.string().min(8),
  age: z.number().int().min(1).max(120).optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const { name, email, phone, password, age, gender, address, occupation } = parsed.data;

    // Check uniqueness
    const existing = await db.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
    if (existing) {
      return NextResponse.json(
        { error: existing.email === email ? 'Email already registered' : 'Phone already registered' },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const membershipId = generateMembershipId();
    const verificationToken = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = await db.user.create({
      data: {
        membershipId,
        name,
        email,
        phone,
        passwordHash,
        role: 'MEMBER',
        age,
        gender,
        address,
        occupation,
      },
    });

    await db.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt,
      },
    });

    // Send verification email (non-blocking on error)
    try {
      await sendVerificationEmail(email, name, verificationToken);
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr);
    }

    return NextResponse.json({ message: 'Account created. Please check your email.' }, { status: 201 });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

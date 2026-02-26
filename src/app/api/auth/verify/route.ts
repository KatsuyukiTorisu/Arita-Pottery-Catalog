import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    const record = await db.emailVerificationToken.findUnique({ where: { token } });

    if (!record) {
      return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      await db.emailVerificationToken.delete({ where: { id: record.id } });
      return NextResponse.json({ error: 'Verification token has expired' }, { status: 400 });
    }

    // Mark email as verified
    await db.user.update({
      where: { id: record.userId },
      data: { emailVerifiedAt: new Date() },
    });

    // Clean up token
    await db.emailVerificationToken.delete({ where: { id: record.id } });

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Verify error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

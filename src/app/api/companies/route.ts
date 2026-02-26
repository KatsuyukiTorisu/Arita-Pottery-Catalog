import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { companySchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const companies = await db.company.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { products: { where: { isPublished: true } } } } },
    });

    return NextResponse.json({ companies });
  } catch (err) {
    console.error('Companies GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'COMPANY' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // COMPANY users can only create one company
    if (session.role === 'COMPANY') {
      const existing = await db.company.findUnique({ where: { ownerUserId: session.userId } });
      if (existing) {
        return NextResponse.json({ error: 'You already have a company' }, { status: 409 });
      }
    }

    const body = await request.json();
    const parsed = companySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', issues: parsed.error.issues }, { status: 400 });
    }

    const { name, description, location, images } = parsed.data;
    const slug = slugify(name);

    const company = await db.company.create({
      data: { name, slug, description, location, images, ownerUserId: session.userId },
    });

    return NextResponse.json({ company }, { status: 201 });
  } catch (err) {
    console.error('Companies POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { companySchema } from '@/lib/validations';

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    const company = await db.company.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
        },
        owner: { select: { name: true, email: true } },
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (err) {
    console.error('Company GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const company = await db.company.findUnique({ where: { slug } });
    if (!company) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (session.role !== 'ADMIN' && company.ownerUserId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = companySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', issues: parsed.error.issues }, { status: 400 });
    }

    const updated = await db.company.update({
      where: { slug },
      data: parsed.data,
    });

    return NextResponse.json({ company: updated });
  } catch (err) {
    console.error('Company PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const company = await db.company.findUnique({ where: { slug } });
    if (!company) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (session.role !== 'ADMIN' && company.ownerUserId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.company.delete({ where: { slug } });
    return NextResponse.json({ message: 'Company deleted' });
  } catch (err) {
    console.error('Company DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

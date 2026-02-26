import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { productSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = request.nextUrl;
    const companyId = searchParams.get('companyId');

    const where: Record<string, unknown> = { isPublished: true };

    if (companyId) where.companyId = companyId;

    // Non-members only see PUBLIC products outside market period
    // The detail gate is enforced at the page level; list just shows card stubs
    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        company: { select: { id: true, name: true, slug: true } },
      },
    });

    // Strip price from non-member view
    const isMember = !!session;
    const result = products.map((p) => ({
      ...p,
      price: isMember ? p.price : null,
    }));

    return NextResponse.json({ products: result });
  } catch (err) {
    console.error('Products GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'COMPANY' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const company = await db.company.findUnique({ where: { ownerUserId: session.userId } });
    if (!company && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No company found for this account' }, { status: 404 });
    }

    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', issues: parsed.error.issues }, { status: 400 });
    }

    const companyId = body.companyId ?? company?.id;
    if (!companyId) return NextResponse.json({ error: 'companyId required' }, { status: 400 });

    const product = await db.product.create({
      data: { ...parsed.data, companyId },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error('Products POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { productSchema } from '@/lib/validations';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const session = await getSession();

    const product = await db.product.findUnique({
      where: { id },
      include: {
        company: true,
        whitelist: { select: { memberUserId: true } },
      },
    });

    if (!product || !product.isPublished) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Visibility checks
    if (product.visibilityMode === 'MEMBERS_ONLY' && !session) {
      return NextResponse.json({ error: 'Members only', code: 'MEMBERS_ONLY' }, { status: 403 });
    }

    if (product.visibilityMode === 'WHITELIST') {
      if (!session) return NextResponse.json({ error: 'Members only', code: 'MEMBERS_ONLY' }, { status: 403 });
      const inWhitelist = product.whitelist.some((w) => w.memberUserId === session.userId);
      if (!inWhitelist && session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Not in whitelist', code: 'NOT_WHITELISTED' }, { status: 403 });
      }
    }

    // Strip price for non-members
    const result = { ...product, price: session ? product.price : null };

    return NextResponse.json({ product: result });
  } catch (err) {
    console.error('Product GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const product = await db.product.findUnique({
      where: { id },
      include: { company: true },
    });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isOwner = product.company.ownerUserId === session.userId;
    if (!isOwner && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', issues: parsed.error.issues }, { status: 400 });
    }

    const updated = await db.product.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ product: updated });
  } catch (err) {
    console.error('Product PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const product = await db.product.findUnique({
      where: { id },
      include: { company: true },
    });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isOwner = product.company.ownerUserId === session.userId;
    if (!isOwner && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Product DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

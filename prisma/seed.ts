import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');
const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

function generateMembershipId(prefix: string): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

async function main() {
  console.log('🌱 Seeding database...');

  // Idempotent: skip if data already exists
  const existingUser = await prisma.user.findFirst({ where: { phone: '+81-0000-0001' } });
  if (existingUser) {
    console.log('✅ Seed already applied — skipping.');
    return;
  }

  const now = new Date();

  // --- ADMIN ---
  const adminUser = await prisma.user.create({
    data: {
      membershipId: generateMembershipId('ART'),
      name: 'Admin User',
      email: 'admin@arita-catalog.jp',
      phone: '+81-0000-0001',
      passwordHash: await bcrypt.hash('Admin123!', 12),
      role: 'ADMIN',
      emailVerifiedAt: now,
    },
  });

  // --- COMPANY USER ---
  const companyUser = await prisma.user.create({
    data: {
      membershipId: generateMembershipId('ART'),
      name: 'Pottery Company',
      email: 'company@pottery.jp',
      phone: '+81-0000-0002',
      passwordHash: await bcrypt.hash('Company123!', 12),
      role: 'COMPANY',
      emailVerifiedAt: now,
    },
  });

  // --- MEMBER USER ---
  const memberUser = await prisma.user.create({
    data: {
      membershipId: generateMembershipId('ART'),
      name: 'Test Member',
      email: 'member@example.com',
      phone: '+81-0000-0003',
      passwordHash: await bcrypt.hash('Member123!', 12),
      role: 'MEMBER',
      emailVerifiedAt: now,
      age: 35,
      gender: 'other',
      address: 'Tokyo, Japan',
      occupation: 'Designer',
    },
  });

  // --- COMPANY ---
  const company = await prisma.company.create({
    data: {
      name: 'Yamashiro Pottery',
      slug: 'yamashiro-pottery',
      description:
        'Yamashiro Pottery is a family-run kiln established in 1892, specializing in traditional Arita porcelain with delicate blue-and-white patterns.',
      location: 'Arita, Saga Prefecture, Japan',
      images: [],
      ownerUserId: companyUser.id,
    },
  });

  // --- PRODUCTS ---
  const product1 = await prisma.product.create({
    data: {
      companyId: company.id,
      name: 'Arita Blue Dragon Vase',
      description:
        'Hand-painted blue and white porcelain vase featuring traditional dragon motifs. Each piece is unique, fired at 1300°C in our wood-fired kiln.',
      images: [],
      price: 38000,
      category: 'Vase',
      tags: ['blue-white', 'traditional', 'dragon', 'handmade'],
      isPublished: true,
      visibilityMode: 'PUBLIC',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      companyId: company.id,
      name: 'Imperial Celadon Tea Set',
      description:
        'A 5-piece celadon tea set inspired by Song dynasty aesthetics. Includes teapot, lid, and four cups. Members-exclusive pricing.',
      images: [],
      price: 85000,
      category: 'Tea Set',
      tags: ['celadon', 'tea', 'set', 'imperial'],
      isPublished: true,
      visibilityMode: 'MEMBERS_ONLY',
    },
  });

  const product3 = await prisma.product.create({
    data: {
      companyId: company.id,
      name: 'Gold Kintsugi Bowl (Limited)',
      description:
        'Limited edition kintsugi bowl repaired with 24k gold. Only 10 pieces produced per year. Available by invitation only.',
      images: [],
      price: 250000,
      category: 'Bowl',
      tags: ['kintsugi', 'gold', 'limited', 'exclusive'],
      isPublished: true,
      visibilityMode: 'WHITELIST',
    },
  });

  // Add member to whitelist for product3
  await prisma.productWhitelist.create({
    data: {
      productId: product3.id,
      memberUserId: memberUser.id,
    },
  });

  console.log('✅ Seed complete!');
  console.log(`   Admin:   ${adminUser.email} / Admin123!`);
  console.log(`   Company: ${companyUser.email} / Company123!`);
  console.log(`   Member:  ${memberUser.email} / Member123!`);
  console.log(`   Company: ${company.name} (slug: ${company.slug})`);
  console.log(`   Products: ${product1.name}, ${product2.name}, ${product3.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

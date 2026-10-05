import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/client.js';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo seller
  const passwordHash = await bcrypt.hash('Seller@12345', 10);

  const seller = await prisma.user.upsert({
    where: {
      email: 'seller@uniquemarket.et',
    },
    update: {},
    create: {
      name: 'UniqueMarket Seller',
      email: 'seller@uniquemarket.et',
      passwordHash,
      role: 'SELLER',
    },
  });

  // Create demo store
  const store = await prisma.store.upsert({
    where: {
      slug: 'unique-market-store',
    },
    update: {
      status: 'ACTIVE',
    },
    create: {
      ownerId: seller.id,
      name: 'UniqueMarket Store',
      slug: 'unique-market-store',
      description: 'A demo store for Ethiopian products.',
      status: 'ACTIVE',
    },
  });

  // Create categories
  const categories = [
    {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Clothing, shoes, and fashion products.',
    },
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Phones, accessories, and electronic products.',
    },
    {
      name: 'Home & Living',
      slug: 'home-living',
      description: 'Products for your home and everyday life.',
    },
    {
      name: 'Food & Beverage',
      slug: 'food-beverage',
      description: 'Local food, coffee, and beverage products.',
    },
  ];

  const categoryMap: Record<string, string> = {};

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });

    categoryMap[category.slug] = created.id;
  }

  // Create demo products
  const products = [
    {
      name: 'Traditional Ethiopian Scarf',
      slug: 'traditional-ethiopian-scarf',
      description:
        'Beautiful locally made Ethiopian scarf suitable for everyday wear and special occasions.',
      priceEtb: 850,
      stock: 25,
      categorySlug: 'fashion',
    },
    {
      name: 'Handmade Leather Bag',
      slug: 'handmade-leather-bag',
      description:
        'Locally crafted leather bag made by Ethiopian artisans.',
      priceEtb: 1800,
      stock: 15,
      categorySlug: 'fashion',
    },
    {
      name: 'Wireless Bluetooth Speaker',
      slug: 'wireless-bluetooth-speaker',
      description:
        'Portable Bluetooth speaker with clear sound and rechargeable battery.',
      priceEtb: 2200,
      stock: 20,
      categorySlug: 'electronics',
    },
    {
      name: 'USB-C Fast Charger',
      slug: 'usb-c-fast-charger',
      description:
        'Compact fast charger suitable for modern smartphones and devices.',
      priceEtb: 950,
      stock: 30,
      categorySlug: 'electronics',
    },
    {
      name: 'Ethiopian Coffee Beans',
      slug: 'ethiopian-coffee-beans',
      description:
        'Premium Ethiopian coffee beans sourced from local coffee-growing regions.',
      priceEtb: 650,
      stock: 50,
      categorySlug: 'food-beverage',
    },
    {
      name: 'Handmade Coffee Cup',
      slug: 'handmade-coffee-cup',
      description:
        'Beautiful locally crafted coffee cup inspired by Ethiopian coffee culture.',
      priceEtb: 450,
      stock: 40,
      categorySlug: 'home-living',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        storeId_slug: {
          storeId: store.id,
          slug: product.slug,
        },
      },
      update: {
        name: product.name,
        description: product.description,
        priceEtb: product.priceEtb,
        stock: product.stock,
        categoryId: categoryMap[product.categorySlug],
        status: 'ACTIVE',
      },
      create: {
        storeId: store.id,
        categoryId: categoryMap[product.categorySlug],
        name: product.name,
        slug: product.slug,
        description: product.description,
        priceEtb: product.priceEtb,
        stock: product.stock,
        status: 'ACTIVE',
      },
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log(`Store: ${store.name}`);
  console.log(`Categories: ${categories.length}`);
  console.log(`Products: ${products.length}`);
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
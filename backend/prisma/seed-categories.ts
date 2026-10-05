import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/client.ts';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Creating marketplace categories...');

  const categories = [
    {
      name: 'Fashion & Clothing',
      slug: 'fashion-clothing',
      description: 'Clothing, shoes, bags, and fashion products.',
    },
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Phones, computers, accessories, and electronic products.',
    },
    {
      name: 'Food & Beverage',
      slug: 'food-beverage',
      description: 'Food, coffee, beverages, and local products.',
    },
    {
      name: 'Home & Living',
      slug: 'home-living',
      description: 'Furniture, home accessories, kitchen, and household products.',
    },
    {
      name: 'Beauty & Personal Care',
      slug: 'beauty-personal-care',
      description: 'Beauty, cosmetics, skincare, and personal care products.',
    },
    {
      name: 'Health & Wellness',
      slug: 'health-wellness',
      description: 'Health, wellness, and related products.',
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Jewelry, watches, bags, and other accessories.',
    },
    {
      name: 'Other',
      slug: 'other',
      description: 'Other products and services.',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });

    console.log(`✅ ${category.name}`);
  }

  console.log(`\n🎉 ${categories.length} categories are ready.`);
}

main()
  .catch((error) => {
    console.error('❌ Category seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
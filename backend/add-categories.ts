import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './src/generated/client.js';
import 'dotenv/config';
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: 'Food & Beverages',
    description: 'Food, drinks, and grocery products',
  },
  {
    name: 'Chocolate & Confectionery',
    description: 'Chocolate, candy, sweets, and confectionery',
  },
  {
    name: 'Biscuits & Snacks',
    description: 'Biscuits, wafers, cookies, and snacks',
  },
  {
    name: 'Tea & Coffee',
    description: 'Tea, coffee, and related products',
  },
  {
    name: 'Pasta & Grains',
    description: 'Pasta, grains, cereals, and related food products',
  },
  {
    name: 'Milk & Dairy',
    description: 'Milk powder, dairy products, and related goods',
  },
  {
    name: 'Juices & Drinks',
    description: 'Juices, soft drinks, and beverages',
  },
  {
    name: 'Gum & Candy',
    description: 'Chewing gum, candy, and sweets',
  },
  {
    name: 'Other',
    description: 'Other products that do not fit another category',
  },
];

async function main() {
  for (const category of categories) {
    const slug = category.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: category.name,
        slug,
        description: category.description,
      },
    });

    console.log(`Added: ${category.name}`);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
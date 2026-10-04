import 'dotenv/config';

import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './src/generated/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@sme-marketplace.local';
  const newPassword = 'Admin@12345';

  const passwordHash = await bcrypt.hash(newPassword, 12);

  const admin = await prisma.user.findUnique({
    where: { email },
  });

  if (!admin) {
    throw new Error(`Admin account not found: ${email}`);
  }

  await prisma.user.update({
    where: { email },
    data: {
      passwordHash,
    },
  });

  console.log('Admin password reset successfully.');
  console.log(`Email: ${email}`);
  console.log(`Password: ${newPassword}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
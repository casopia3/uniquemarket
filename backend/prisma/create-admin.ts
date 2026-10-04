import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '../src/generated/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const passwordHash = await bcrypt.hash('admin123', 12);

const admin = await prisma.user.upsert({
  where: {
    email: 'admin@sme-marketplace.local',
  },
  update: {
    passwordHash,
    role: UserRole.ADMIN,
  },
  create: {
    name: 'Marketplace Admin',
    email: 'admin@sme-marketplace.local',
    passwordHash,
    role: UserRole.ADMIN,
  },
});

console.log(`Admin created: ${admin.email}`);

await prisma.$disconnect();
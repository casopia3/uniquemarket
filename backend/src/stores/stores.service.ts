import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole, StoreStatus } from '../generated/client.js';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStoreDto } from './dto/create-store.dto.js';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: { id: string; role: UserRole }, dto: CreateStoreDto) {
    if (user.role !== UserRole.SELLER) {
      throw new ForbiddenException('Only sellers can create a store.');
    }

    const existingStore = await this.prisma.store.findUnique({
      where: {
        ownerId: user.id,
      },
    });

    if (existingStore) {
      throw new ConflictException('You already have a store.');
    }

    const baseSlug = dto.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const slug = `${baseSlug}-${user.id.slice(-6)}`;

    return this.prisma.store.create({
      data: {
        ownerId: user.id,
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim() || null,
       status: StoreStatus.ACTIVE,
      },
    });
  }
  async getMyStore(user: { id: string; role: UserRole }) {
  if (user.role !== UserRole.SELLER) {
    throw new ForbiddenException('Only sellers can access their store.');
  }

  const store = await this.prisma.store.findUnique({
    where: {
      ownerId: user.id,
    },
    include: {
      products: true,
    },
  });

  if (!store) {
    throw new NotFoundException('Store not found.');
  }

  return store;
}
}
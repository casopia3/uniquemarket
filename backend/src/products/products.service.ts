import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductStatus, UserRole } from '../generated/client.js';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      where: {
        status: ProductStatus.ACTIVE,
        store: {
          status: 'ACTIVE',
        },
      },
      include: {
        category: true,
        store: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        status: ProductStatus.ACTIVE,
        store: {
          status: 'ACTIVE',
        },
      },
      include: {
        category: true,
        store: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  async create(user: { id: string; role: UserRole }, dto: CreateProductDto) {
    if (user.role !== UserRole.SELLER) {
      throw new ForbiddenException('Only sellers can create products.');
    }

    const store = await this.prisma.store.findUnique({
      where: { ownerId: user.id },
    });

    if (!store) {
      throw new NotFoundException(
        'Create your seller store before adding products.',
      );
    }

    if (store.status !== 'ACTIVE') {
      throw new ForbiddenException(
        'Your store must be approved before adding products.',
      );
    }

    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category not found.');
    }

    const baseSlug = dto.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const slug = `${baseSlug}-${Date.now()}`;

    return this.prisma.product.create({
      data: {
        storeId: store.id,
        categoryId: category.id,
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim() || null,
        priceEtb: dto.priceEtb,
        stock: dto.stock,
        imageUrl: dto.imageUrl?.trim() || null,
        status: ProductStatus.ACTIVE,
      },
      include: {
        category: true,
        store: true,
      },
    });
  }
  async findSellerProducts(user: { id: string; role: UserRole }) {
  if (user.role !== UserRole.SELLER) {
    throw new ForbiddenException('Only sellers can view seller products.');
  }

  const store = await this.prisma.store.findUnique({
    where: { ownerId: user.id },
  });

  if (!store) {
    throw new NotFoundException('Seller store not found.');
  }

  return this.prisma.product.findMany({
    where: {
      storeId: store.id,
    },
    include: {
      category: true,
      store: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
}
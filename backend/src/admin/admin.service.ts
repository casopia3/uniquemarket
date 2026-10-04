import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreStatus, UserRole } from '../generated/client.js';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async approveStore(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: {
        id: storeId,
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found.');
    }

    return this.prisma.store.update({
      where: {
        id: storeId,
      },
      data: {
        status: StoreStatus.ACTIVE,
      },
    });
  }
  async getDashboard() {
  const [
    totalCustomers,
    totalSellers,
    totalStores,
    totalProducts,
    totalOrders,
  ] = await Promise.all([
    this.prisma.user.count({
      where: {
        role: 'CUSTOMER',
      },
    }),

    this.prisma.user.count({
      where: {
        role: 'SELLER',
      },
    }),

    this.prisma.store.count(),

    this.prisma.product.count(),

    this.prisma.order.count(),
  ]);

  return {
    totalCustomers,
    totalSellers,
    totalStores,
    totalProducts,
    totalOrders,
  };
}
async getSellers() {
  return this.prisma.user.findMany({
    where: {
      role: UserRole.SELLER,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
}
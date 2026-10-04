import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderStatus,
  UserRole,
} from '../generated/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SellerOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findMyOrders(user: { id: string; role: UserRole }) {
    if (user.role !== UserRole.SELLER) {
      throw new ForbiddenException('Only sellers can access seller orders.');
    }

    const store = await this.prisma.store.findUnique({
      where: {
        ownerId: user.id,
      },
    });

    if (!store) {
      throw new NotFoundException('Seller store not found.');
    }

    return this.prisma.sellerOrder.findMany({
      where: {
        storeId: store.id,
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            deliveryCity: true,
            deliveryAddress: true,
            paymentMethod: true,
            paymentStatus: true,
            totalEtb: true,
            createdAt: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async updateStatus(
  user: { id: string; role: UserRole },
  sellerOrderId: string,
  status: OrderStatus,
) {
  if (user.role !== UserRole.SELLER) {
    throw new ForbiddenException(
      'Only sellers can update seller orders.',
    );
  }

  const store = await this.prisma.store.findUnique({
    where: {
      ownerId: user.id,
    },
  });

  if (!store) {
    throw new NotFoundException('Seller store not found.');
  }

  const sellerOrder = await this.prisma.sellerOrder.findFirst({
    where: {
      id: sellerOrderId,
      storeId: store.id,
    },
  });

  if (!sellerOrder) {
    throw new NotFoundException('Seller order not found.');
  }

  return this.prisma.sellerOrder.update({
    where: {
      id: sellerOrderId,
    },
    data: {
      status,
    },
  });
}
}
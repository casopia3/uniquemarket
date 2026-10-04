import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '../generated/client.js';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(customerId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        customerId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty.');
    }

    for (const item of cart.items) {
      if (item.product.status !== 'ACTIVE') {
        throw new BadRequestException(
          `${item.product.name} is no longer available.`,
        );
      }

      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Only ${item.product.stock} units of ${item.product.name} are available.`,
        );
      }
    }

    const totalEtb = cart.items.reduce(
      (total, item) =>
        total + item.product.priceEtb * item.quantity,
      0,
    );

    const orderNumber = `SME-${Date.now()}`;

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,

          customerName: dto.customerName.trim(),
          customerPhone: dto.customerPhone.trim(),
          deliveryCity: dto.deliveryCity.trim(),
          deliveryAddress: dto.deliveryAddress.trim(),

          totalEtb,
          paymentMethod: dto.paymentMethod,
          paymentStatus: PaymentStatus.PENDING,
          status: OrderStatus.PENDING,
        },
      });

      const sellerGroups = new Map<
        string,
        {
          storeId: string;
          subtotalEtb: number;
          items: typeof cart.items;
        }
      >();

      for (const item of cart.items) {
        const storeId = item.product.storeId;
        const lineTotalEtb =
          item.product.priceEtb * item.quantity;

        const existing = sellerGroups.get(storeId);

        if (existing) {
          existing.subtotalEtb += lineTotalEtb;
          existing.items.push(item);
        } else {
          sellerGroups.set(storeId, {
            storeId,
            subtotalEtb: lineTotalEtb,
            items: [item],
          });
        }
      }

      for (const sellerGroup of sellerGroups.values()) {
        const sellerOrder = await tx.sellerOrder.create({
          data: {
            orderId: createdOrder.id,
            storeId: sellerGroup.storeId,
            subtotalEtb: sellerGroup.subtotalEtb,
            status: OrderStatus.PENDING,
          },
        });

        for (const item of sellerGroup.items) {
          const lineTotalEtb =
            item.product.priceEtb * item.quantity;

          await tx.orderItem.create({
            data: {
              orderId: createdOrder.id,
              sellerOrderId: sellerOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPriceEtb: item.product.priceEtb,
              lineTotalEtb,
            },
          });

          await tx.product.update({
            where: {
              id: item.productId,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      if (dto.paymentMethod === PaymentMethod.CHAPA) {
        await tx.payment.create({
          data: {
            orderId: createdOrder.id,
            provider: PaymentMethod.CHAPA,
            amountEtb: totalEtb,
            status: PaymentStatus.PENDING,
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return createdOrder;
    });

    return {
      message: 'Order created successfully.',
      order,
    };
  }

  async findMyOrders(customerId: string) {
    return this.prisma.order.findMany({
      where: {
        customerId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        sellerOrders: {
          include: {
            store: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(customerId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        sellerOrders: {
          include: {
            store: true,
          },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return order;
  }
}
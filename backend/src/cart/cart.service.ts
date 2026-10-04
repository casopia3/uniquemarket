import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}
async updateItem(
  userId: string,
  itemId: string,
  quantity: number,
) {
  const cart = await this.prisma.cart.findUnique({
    where: {
      customerId: userId,
    },
  })

  if (!cart) {
    throw new NotFoundException('Cart not found')
  }

  const item = await this.prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
    include: {
      product: true,
    },
  })

  if (!item) {
    throw new NotFoundException('Cart item not found')
  }

  if (quantity > item.product.stock) {
    throw new BadRequestException(
      `Only ${item.product.stock} items are available`,
    )
  }

  if (quantity <= 0) {
    await this.prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    })

    return {
      message: 'Item removed from cart',
    }
  }

  return this.prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity,
    },
    include: {
      product: {
        include: {
          store: true,
          category: true,
        },
      },
    },
  })
}

async removeItem(
  userId: string,
  itemId: string,
) {
  const cart = await this.prisma.cart.findUnique({
    where: {
      customerId: userId,
    },
  })

  if (!cart) {
    throw new NotFoundException('Cart not found')
  }

  const item = await this.prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  })

  if (!item) {
    throw new NotFoundException('Cart item not found')
  }

  await this.prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  })

  return {
    message: 'Item removed from cart',
  }
}
  async addItem(customerId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: dto.productId,
        status: 'ACTIVE',
        store: {
          status: 'ACTIVE',
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException(
        `Only ${product.stock} units are available.`,
      );
    }

    let cart = await this.prisma.cart.findUnique({
      where: {
        customerId,
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          customerId,
        },
      });
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id,
        },
      },
    });

    const newQuantity = existingItem
      ? existingItem.quantity + dto.quantity
      : dto.quantity;

    if (newQuantity > product.stock) {
      throw new BadRequestException(
        `Only ${product.stock} units are available.`,
      );
    }

    const item = existingItem
      ? await this.prisma.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: newQuantity,
          },
          include: {
            product: true,
          },
        })
      : await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            quantity: dto.quantity,
          },
          include: {
            product: true,
          },
        });

    return {
      message: 'Product added to cart.',
      item,
    };
  }
  async getCart(customerId: string) {
  const cart = await this.prisma.cart.findUnique({
    where: {
      customerId,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              store: true,
              category: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return {
      id: null,
      items: [],
      subtotalEtb: 0,
    };
  }

  const subtotalEtb = cart.items.reduce(
    (total, item) => total + item.product.priceEtb * item.quantity,
    0,
  );

  return {
    id: cart.id,
    items: cart.items,
    subtotalEtb,
  };
}
}
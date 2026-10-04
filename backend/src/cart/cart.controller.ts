import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  Delete,
  Param,
  Patch,
} from '@nestjs/common'
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { CartService } from './cart.service.js';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}
@Patch('items/:itemId')
updateItem(
  @Req() request: Request,
  @Param('itemId') itemId: string,
  @Body('quantity') quantity: number,
) {
  return this.cartService.updateItem(
    (request.user as any).id,
    itemId,
    Number(quantity),
  )
}

@Delete('items/:itemId')
removeItem(
  @Req() request: Request,
  @Param('itemId') itemId: string,
) {
  return this.cartService.removeItem(
    (request.user as any).id,
    itemId,
  )
}
  @Post('items')
  addItem(
    @Req() request: Request,
    @Body() dto: AddToCartDto,
  ) {
    const user = request.user as { id: string };

    return this.cartService.addItem(user.id, dto);
  }
  @Get()
getCart(@Req() request: Request) {
  const user = request.user as { id: string };

  return this.cartService.getCart(user.id);
}
}
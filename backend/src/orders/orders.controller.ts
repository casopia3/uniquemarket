import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrdersService } from './orders.service.js';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  create(
    @Req() request: Request,
    @Body() dto: CreateOrderDto,
  ) {
    const user = request.user as { id: string };

    return this.ordersService.create(user.id, dto);
  }

  @Get('my')
  findMyOrders(@Req() request: Request) {
    const user = request.user as { id: string };

    return this.ordersService.findMyOrders(user.id);
  }

  @Get(':id')
  findOne(
    @Req() request: Request,
    @Param('id') orderId: string,
  ) {
    const user = request.user as { id: string };

    return this.ordersService.findOne(user.id, orderId);
  }
}
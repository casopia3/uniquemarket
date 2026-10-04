import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../generated/client.js';

import { SellerOrdersService } from './seller-orders.service.js';

@Controller('seller/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SELLER)
export class SellerOrdersController {
  constructor(
    private readonly sellerOrdersService: SellerOrdersService,
  ) {}

  @Get()
  findMyOrders(@Req() request: Request) {
    return this.sellerOrdersService.findMyOrders(
      request.user as any,
    );
  }
  @Patch(':id/status')
updateStatus(
  @Req() request: Request,
  @Param('id') sellerOrderId: string,
  @Body() dto: UpdateOrderStatusDto,
) {
  return this.sellerOrdersService.updateStatus(
    request.user as any,
    sellerOrderId,
    dto.status,
  );
}
}
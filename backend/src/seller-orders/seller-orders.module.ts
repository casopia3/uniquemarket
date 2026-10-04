import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { SellerOrdersController } from './seller-orders.controller.js';
import { SellerOrdersService } from './seller-orders.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [SellerOrdersController],
  providers: [SellerOrdersService],
})
export class SellerOrdersModule {}
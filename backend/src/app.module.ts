import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { StoresModule } from './stores/stores.module.js';
import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { AdminModule } from './admin/admin.module.js';
import { CategoriesController } from './categories/categories.controller.js';
import { CategoriesService } from './categories/categories.service.js';
import { CategoriesModule } from './categories/categories.module.js';
import { CartModule } from './cart/cart.module.js';
import { SellerOrdersModule } from './seller-orders/seller-orders.module.js';
@Module({
imports: [
ConfigModule.forRoot({
isGlobal: true,
}),
PrismaModule,
AuthModule,
UsersModule,
StoresModule,
ProductsModule,
OrdersModule,
PaymentsModule,
AdminModule,
CategoriesModule,
CartModule,
SellerOrdersModule
],
controllers: [AppController, CategoriesController],
providers: [AppService, CategoriesService],
})
export class AppModule {}

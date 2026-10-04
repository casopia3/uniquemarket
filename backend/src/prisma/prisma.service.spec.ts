import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// @ts-ignore - Prisma client types are generated during the Prisma install/generate step.
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await (this as any).$connect();
  }

  async onModuleDestroy() {
    await (this as any).$disconnect();
  }
}
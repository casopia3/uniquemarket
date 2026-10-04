import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UserRole } from '../generated/client.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

import { StoresService } from './stores.service.js';
import { CreateStoreDto } from './dto/create-store.dto.js';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  getMyStore(@Req() request: Request) {
    return this.storesService.getMyStore(request.user as any);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  create(@Req() request: Request, @Body() dto: CreateStoreDto) {
    return this.storesService.create(request.user as any, dto);
  }
}
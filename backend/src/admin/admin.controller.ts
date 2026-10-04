import {
  Controller,
  Param,
   Get,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { UserRole } from '../generated/client.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { AdminService } from './admin.service.js';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('stores/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  approveStore(@Param('id') storeId: string) {
    return this.adminService.approveStore(storeId);
  }
  @Get('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
getDashboard() {
  return this.adminService.getDashboard();
}
@Get('sellers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
getSellers() {
  return this.adminService.getSellers();
}
}
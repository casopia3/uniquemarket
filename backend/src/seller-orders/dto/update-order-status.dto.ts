import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../generated/client.js';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
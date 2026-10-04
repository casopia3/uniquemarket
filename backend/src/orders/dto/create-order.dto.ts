import {
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';

import { PaymentMethod } from '../../generated/client.js';

export class CreateOrderDto {
  @IsString()
  @MinLength(2)
  customerName!: string;

  @IsString()
  @MinLength(7)
  customerPhone!: string;

  @IsString()
  @MinLength(2)
  deliveryCity!: string;

  @IsString()
  @MinLength(5)
  deliveryAddress!: string;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;
}
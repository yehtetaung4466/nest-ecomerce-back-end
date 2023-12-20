import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  itemId: number;
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;
}

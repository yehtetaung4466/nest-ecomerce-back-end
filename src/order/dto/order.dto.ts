import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class OrderObject {
  @IsNumber({}, { message: 'quantity must be a number' })
  @IsNotEmpty()
  @Type(() => Number)
  itemId: number;
  @IsNumber({}, { message: 'quantity must be a number' })
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;
}
export class OrderDto {
  @IsNotEmpty()
  @IsString()
  comment: string;
  @IsUUID()
  @IsNotEmpty()
  orderGroupId: string;
  @ValidateNested({
    each: true,
    message: `each must be {itemId:number,quantity:number}`,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => OrderObject)
  orders: OrderObject[];
}

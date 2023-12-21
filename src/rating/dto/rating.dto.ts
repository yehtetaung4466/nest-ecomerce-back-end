import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class RationDto {
  @IsNotEmpty()
  @IsString()
  opinion: string;
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Max(5.0)
  @Min(0.0)
  rating: number;
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  itemId: number;
}

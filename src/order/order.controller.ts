import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Request } from 'express';
import { ITokenPayload } from 'src/utils/interfaces';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  makeNewOrder(@Body() dto: OrderDto, @Req() req: Request) {
    const user = req.user as ITokenPayload;
    return this.orderService.createNewOrder(user.sub, dto.itemId, dto.quantity);
  }
  @Get(':orderId')
  getOneOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.getOrderById(orderId);
  }
}

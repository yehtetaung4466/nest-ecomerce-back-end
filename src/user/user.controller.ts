import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Request } from 'express';
import { TokenPayload } from 'src/utils/interfaces';
import { OrderService } from 'src/order/order.service';
import { CheckUserExitGuard } from 'src/guards/checkUserExit.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) {}
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() req: Request) {
    const user = req.user as TokenPayload;
    return this.userService.getUserbyId(user.sub);
  }
  @Get('me/orders')
  @UseGuards(JwtAuthGuard)
  getOrdersOfCurrentUser(@Req() req: Request) {
    const user = req.user as TokenPayload;
    return this.orderService.getOrdersByUserId(user.sub);
  }
  @UseGuards(CheckUserExitGuard)
  @Get(':userId/orders')
  getOrdersOfSpecificUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.orderService.getOrdersByUserId(userId);
  }
}

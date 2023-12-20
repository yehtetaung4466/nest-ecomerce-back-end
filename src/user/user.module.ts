import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [DrizzleModule, OrderModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

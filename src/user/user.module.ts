import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Module({
  controllers: [UserController],
  providers: [UserService, DrizzleService],
})
export class UserModule {}

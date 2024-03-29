import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { JwtRefreshStrategy } from 'src/strategies/jwt.refresh.strategy';
import { JwtAdminStrategy } from 'src/strategies/jwt.admin.strategy';

@Module({
  imports: [PassportModule, DrizzleModule],
  providers: [
    AuthService,
    JwtService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtAdminStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

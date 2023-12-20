import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from 'src/strategies/jwtRefresh.strategy';

@Module({
  imports: [PassportModule, DrizzleModule],
  providers: [AuthService, JwtService, JwtStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

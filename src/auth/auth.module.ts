import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from '../strategies/google.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGoogleService } from './auth.google.service';
import { JwtService } from './jwt.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from 'src/strategies/jwtRefresh.strategy';

@Module({
  imports: [PassportModule, DrizzleModule],
  providers: [
    AuthService,
    GoogleStrategy,
    AuthGoogleService,
    JwtService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

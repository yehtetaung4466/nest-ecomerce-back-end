import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from 'src/utils/interfaces';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  async validate(payload: TokenPayload) {
    if (payload.type !== 'access' || payload.role !== 'admin')
      throw new UnauthorizedException('Unauthorized');
    return payload;
  }
}

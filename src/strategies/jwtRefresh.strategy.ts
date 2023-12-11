import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { ITokenPayload } from 'src/utils/interfaces';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
      authService,
    });
  }
  async validate(req: Request, payload: ITokenPayload) {
    const refreshToken = req.header('Authorization').split(' ')[1];
    const isMatch = await this.authService.checkIfRefreshTokenMet(
      payload.sub,
      refreshToken,
    );
    if (!isMatch) {
      throw new UnauthorizedException('invalid token');
    } else {
      return payload;
    }
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { users } from 'src/drizzle/schema';
import * as argon from 'argon2';
import { eq } from 'drizzle-orm';
import * as dayjs from 'dayjs';
import { JwtService } from './jwt.service';
import { PostgresError } from 'postgres';
import { Roles } from 'src/utils/interfaces';
@Injectable()
export class AuthService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(name: string, email: string, password: string) {
    const hash = await argon.hash(password);
    await this.drizzleService.db
      .insert(users)
      .values({ name, email, password: hash })
      .catch((e) => {
        if (e instanceof PostgresError) {
          if (e.constraint_name === 'users_email_unique') {
            throw new BadRequestException('email already exit');
          }
        }
      });
    return { message: 'successfully signed in' };
  }

  async logIn(email: string, password: string) {
    const user = await this.drizzleService.db.query.users.findFirst({
      where: eq(users.email, email),
      columns: {
        id: true,
        password: true,
        role: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }
    const isMatch = await argon.verify(user.password, password);
    if (!isMatch) {
      throw new UnauthorizedException('invalid credentials');
    }
    const token_s = this.jwtService.generateTokens(user.id, user.role);
    return token_s;
  }
  async jwtRefresh(sub: number, expOfRefreshToken: number, role: Roles) {
    const currentTime = Date.now() / 1000;
    const diff = expOfRefreshToken - currentTime;
    const tokens = this.jwtService.generateTokens(sub, role);
    const twoDays = 2 * 60 * 60 * 24;
    return diff < twoDays
      ? { msg: 'refresh token is expiring soon thus issued a new one', tokens }
      : { accessToken: tokens.accessToken };
  }
}

//

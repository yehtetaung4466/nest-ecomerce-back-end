import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { tokens, users } from 'src/drizzle/schema';
import * as argon from 'argon2';
import { eq } from 'drizzle-orm';
import * as dayjs from 'dayjs';
import { JwtService } from './jwt.service';
import { PostgresError } from 'postgres';
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
      },
    });

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }
    const isMatch = await argon.verify(user.password, password);
    if (!isMatch) {
      throw new UnauthorizedException('invalid credentials');
    }
    const token_s = this.jwtService.generateTokens(user.id);
    try {
      await this.drizzleService.db
        .insert(tokens)
        .values({ refresh_token: token_s.refreshToken, user_id: user.id });
    } catch (err) {
      if (err instanceof PostgresError) {
        if (err.constraint_name === 'token_user_id_unique') {
          await this.drizzleService.db
            .update(tokens)
            .set({
              refresh_token: token_s.refreshToken,
              updatedAt: dayjs(Date.now()).toISOString(),
            })
            .where(eq(tokens.user_id, user.id));
        }
        throw new PostgresError(err.stack);
      }
    }
    return token_s;
  }
  async jwtRefresh(sub: number) {
    const token_s = this.jwtService.generateTokens(sub);
    await this.drizzleService.db
      .update(tokens)
      .set({ refresh_token: token_s.refreshToken })
      .where(eq(tokens.user_id, sub));
    return token_s;
  }
  async checkIfRefreshTokenMet(sub: number, refreshToken: string) {
    const { refresh_token: db_refreshToken } =
      await this.drizzleService.db.query.tokens.findFirst({
        where: eq(tokens.user_id, sub),
        columns: {
          refresh_token: true,
        },
      });
    if (!db_refreshToken) {
      throw new UnauthorizedException('invalid token');
    }
    const isMatch = refreshToken === db_refreshToken;
    return isMatch;
  }
}
//

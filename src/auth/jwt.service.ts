import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from 'src/utils/interfaces';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}
  //jwt
  //   async getUserIfRefreshTokenMatches(
  //     refreshToken: string,
  //     tokenId: string,
  //     payload: ITokenPayload,
  //   ) {
  //     const foundToken = await this.drizzleService.db.query.tokens.findFirst({
  //       where: eq(tokens.id, tokenId),
  //     });
  //     const isMatch = await argon.verify(
  //       foundToken.refresh_token ?? '',
  //       refreshToken,
  //     );

  //     const issuedAt = dayjs.unix(payload.iat);
  //     const diff = dayjs().diff(issuedAt, 'seconds');

  //     if (foundToken == null) {
  //       //refresh token is valid but the id is not in database
  //       //TODO:inform the user with the payload sub
  //       throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  //     }

  //     if (isMatch) {
  //       return await this.generateTokens(payload, tokenId);
  //     } else {
  //       //less than 1 minute leeway allows refresh for network concurrency
  //       if (diff < 60 * 1 * 1) {
  //         // console.log('leeway');
  //         return await this.generateTokens(payload, tokenId);
  //       }

  //       //refresh token is valid but not in db
  //       //possible re-use!!! delete all refresh tokens(sessions) belonging to the sub
  //       if (payload.sub !== foundToken.user_id) {
  //         //the sub of the token isn't the id of the token in db
  //         // log out all session of this payalod id, reFreshToken has been compromised
  //         // await this.prismaService.token.deleteMany({
  //         //   where: {
  //         //     userId: payload.sub,
  //         //   },
  //         // });
  //         await this.drizzleService.db
  //           .delete(tokens)
  //           .where(eq(users.id, payload.sub));
  //         throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  //       }

  //       throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  //     }
  //   }

  //   private async generateTokens(payload: ITokenPayload, tokenId: string) {
  //     const accessToken = this.getJwtAccessToken(payload.sub, payload.email);

  //     const newRefreshToken = this.getJwtRefreshToken(payload.sub, payload.email);

  //     // const hash = await argon.hash(newRefreshToken);

  //     // await this.prismaService.token.update({
  //     //   where: {
  //     //     id: tokenId,
  //     //   },
  //     //   data: {
  //     //     refreshToken: hash,
  //     //   },
  //     // });
  //     // await this.drizzleService.db.update(tokens).set({id:tokenId}).where(eq())

  //     return {
  //       accessToken,
  //       refreshToken: newRefreshToken,
  //       tokenId: tokenId,
  //       //   accessTokenExpires: getAccessExpiry(),
  //       user: {
  //         id: payload.sub,
  //         email: payload.email,
  //       },
  //     };
  //   }

  generateTokens(sub: number) {
    const accessToken = this.getJwtAccessToken(sub);
    const refreshToken = this.getJwtRefreshToken(sub);
    return { accessToken, refreshToken };
  }
  private getJwtAccessToken(sub: number) {
    const payload: TokenPayload = { sub, type: 'access' };
    const accessToken = jwt.sign(
      payload,
      this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      { expiresIn: '10d' },
    );
    return accessToken;
  }

  private getJwtRefreshToken(sub: number) {
    const payload: TokenPayload = { sub, type: 'refresh' };
    const refreshToken = jwt.sign(
      payload,
      this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      {
        expiresIn: '10d',
      },
    );
    return refreshToken;
  }
}

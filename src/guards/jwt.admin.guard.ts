import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAdminGuard extends AuthGuard('jwt-admin') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (info instanceof JsonWebTokenError) {
      if (info instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid Token!');
    }
    return super.handleRequest(err, user, info, context, status);
  }
}

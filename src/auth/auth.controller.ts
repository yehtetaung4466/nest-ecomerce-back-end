import {
  Controller,
  Get,
  UseGuards,
  Res,
  Req,
  UnauthorizedException,
  Body,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthGoogleService } from './auth.google.service';
import { CheckTokenExpiryGuard } from '../guards/google.guard';
import { LogInDto, SignInDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { JwtRefreshGuard } from 'src/guards/jwtRefresh.guard';
import { ITokenPayload } from 'src/utils/interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly googleService: AuthGoogleService,
    private readonly authSerice: AuthService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req) {
    const googleToken = req.user.accessToken;
    const googleRefreshToken = req.user.refreshToken;

    return { googleToken, googleRefreshToken };
  }

  @UseGuards(CheckTokenExpiryGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const accessToken = req.cookies['access_token'];
    if (accessToken)
      return (await this.googleService.getProfile(accessToken)).data;
    throw new UnauthorizedException('No access token');
  }

  @Get('logout')
  logout(@Req() req, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    this.googleService.revokeGoogleToken(refreshToken);
    res.redirect('http://localhost:3000/');
  }

  @Post('signup')
  signUp(@Body() dto: SignInDto) {
    return this.authSerice.signUp(dto.name, dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LogInDto) {
    return this.authSerice.logIn(dto.email, dto.password);
  }
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req: Request) {
    const { sub } = req.user as ITokenPayload;
    return this.authSerice.jwtRefresh(sub);
  }
  @UseGuards(JwtAuthGuard)
  @Get('test')
  test() {
    return { message: 'success' };
  }
}

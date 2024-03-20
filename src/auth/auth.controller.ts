import { Controller, Get, UseGuards, Req, Body, Post } from '@nestjs/common';
import { Request } from 'express';
import { LogInDto, SignInDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { JwtRefreshGuard } from 'src/guards/jwtRefresh.guard';
import { TokenPayload } from 'src/utils/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSerice: AuthService) {}
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
    const { sub, exp, role } = req.user as TokenPayload;
    return this.authSerice.jwtRefresh(sub, exp, role);
  }
  @UseGuards(JwtAuthGuard)
  @Get('test')
  test() {
    return { message: 'success' };
  }
}

import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { Public } from './decorator/customize';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@Request() req: { user: { email: string; _id: string } }) {
    return this.authService.login(req.user);
  }
  @Public()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

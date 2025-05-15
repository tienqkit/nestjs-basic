import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello() {
    console.log(this.configService.get<string>('PORT'));
    return this.appService.getHello();
  }
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@Request() req) {
    return req.user;
  }
}

import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorator/customize';
import { IUser } from 'src/interface/user.interface';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req: { user: IUser }) {
    return this.authService.login(req.user);
  }
}

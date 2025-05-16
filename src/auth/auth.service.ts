import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/interface/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (user) {
      const isValidPassword = this.usersService.checkUserPassword(
        password,
        user.password,
      );
      if (isValidPassword) {
        return user;
      }
    }
    return null;
  }
  login(user: IUser) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token_login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      _id,
      name,
      email,
      role,
    };
  }
}

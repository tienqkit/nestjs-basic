import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/interface/user.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    const refetch_token = this.createRefetchToken(payload);

    return {
      access_token: this.jwtService.sign(payload),
      refetch_token,
      _id,
      name,
      email,
      role,
    };
  }
  async register(user: RegisterUserDto) {
    const newUser = await this.usersService.register(user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }
  createRefetchToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES'),
    });
    return refresh_token;
  };
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
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
  async login(user: IUser, response: Response) {
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
    await this.usersService.updateUserToken(refetch_token, _id);
    // set cookie
    response.cookie('refresh_token', refetch_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
      },
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
  async processRefreshToken(refresh_token: string, response: Response) {
    try {
      this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      const user = await this.usersService.findUserByToken(refresh_token);
      if (!user) {
        throw new BadRequestException(`Invalid refresh token`);
      }
      const { _id, name, email, role } = user;
      const payload = {
        sub: 'token_refresh',
        iss: 'from server',
        _id,
        name,
        email,
        role,
      };
      const refetch_token = this.createRefetchToken(payload);
      await this.usersService.updateUserToken(refetch_token, String(_id));
      // set cookie
      response.clearCookie('refresh_token');
      response.cookie('refresh_token', refetch_token, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      });

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          _id,
          name,
          email,
          role,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Invalid refresh token ${error}`);
    }
  }
}

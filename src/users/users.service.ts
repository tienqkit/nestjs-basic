import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/interface/user.interface';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument, User as UserM } from './schemas/user.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  hashPassword(password: string): string {
    return hashSync(password, genSaltSync(10));
  }
  checkUserPassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const { name, email, password, role, age, gender, address, company } =
      createUserDto;
    const ixExistEmail = await this.userModel.findOne({ email });
    if (ixExistEmail) {
      throw new UnauthorizedException('Email đã tồn tại');
    }
    const hashPassword = this.hashPassword(password);
    const createdUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      role,
      age,
      gender,
      address,
      company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return createdUser;
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserM> {
    const ixExistEmail = await this.userModel.findOne({
      email: registerUserDto.email,
    });
    if (ixExistEmail) {
      throw new UnauthorizedException('Email đã tồn tại');
    }
    const registeredUser = new this.userModel(registerUserDto);
    registeredUser.password = this.hashPassword(registeredUser.password);
    registeredUser.role = 'USER';
    return registeredUser.save();
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select('-password -__v')
      .exec();
    return {
      meta: {
        currentPage: +currentPage,
        pageSize: +limit,
        total: totalItems,
        totalPages: totalPages,
      },
      result,
    };
  }

  findOne(id: string) {
    return this.userModel.findById(id).select('-password -__v');
  }
  findOneByUserName(email: string) {
    return this.userModel.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'not found user';
    }
    return this.userModel.softDelete({ _id: id });
  }

  updateUserToken = async (refetch_token: string, userId: string) => {
    return await this.userModel.updateOne(
      { _id: userId },
      { refresh_token: refetch_token },
    );
  };
}

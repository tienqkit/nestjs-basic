import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}
export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  // @Matches(
  //   /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
  //   {
  //     message:
  //       'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.',
  //   },
  // )
  readonly password: string;
  @IsInt()
  @IsNotEmpty({ message: 'Age is required' })
  readonly age: number;

  @IsNotEmpty({ message: 'Address is required' })
  readonly address: string;

  @IsNotEmpty({ message: 'Gender is required' })
  readonly gender: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsString()
  readonly role: string;

  @IsNotEmpty({ message: 'Company is required' })
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company!: Company;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  readonly password: string;
  @IsInt()
  @IsNotEmpty({ message: 'Age is required' })
  readonly age: number;

  @IsNotEmpty({ message: 'Address is required' })
  readonly address: string;

  @IsNotEmpty({ message: 'Gender is required' })
  readonly gender: string;

  // @IsNotEmpty({ message: 'role is required' })
  // @IsString()
  // readonly role: string;

  // @IsNotEmptyObject()
  // @IsObject()
  // @ValidateNested()
  // @Type(() => Company)
  // company!: Company;
}

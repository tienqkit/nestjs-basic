import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
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
export class CreateJobDto {
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @IsNotEmpty({ message: 'Skills is required' })
  @IsArray({ message: 'Skills must be an array of strings' })
  @IsString({ each: true, message: 'Skills must be an array of strings' })
  readonly skills: string[];

  @IsNotEmpty({ message: 'Company is required' })
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company!: Company;

  @IsInt()
  @IsNotEmpty({ message: 'Salary is required' })
  readonly salary: number;

  @IsInt()
  @IsNotEmpty({ message: 'Quantity is required' })
  readonly quantity: number;

  @IsString()
  @IsNotEmpty({ message: 'Level is required' })
  readonly level: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  readonly description: string;

  @IsNotEmpty({ message: 'Start date is required' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Start date must be a valid date' })
  readonly startDate: Date;

  @IsNotEmpty({ message: 'End date is required' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'End date must be a valid date' })
  readonly endDate: Date;

  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsNotEmpty({ message: 'Is active is required' })
  readonly isActive: boolean;
}

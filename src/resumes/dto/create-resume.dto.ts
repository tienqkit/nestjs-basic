import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  //   @IsNotEmpty({ message: 'Email is required' })
  //   email: string;
  //   @IsNotEmpty({ message: 'UserId is required' })
  //   userId: string;
  @IsNotEmpty({ message: 'Url is required' })
  url: string;
  @IsNotEmpty({ message: 'Status is required' })
  status: string;
  @IsNotEmpty({ message: 'CompanyId is required' })
  companyId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty({ message: 'JobId is required' })
  JobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: 'Url is required' })
  url: string;

  @IsNotEmpty({ message: 'CompanyId is required' })
  @IsMongoId({ message: 'CompanyId is invalid' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'JobId is required' })
  @IsMongoId({ message: 'Jobs is invalid' })
  jobId: mongoose.Schema.Types.ObjectId;
}

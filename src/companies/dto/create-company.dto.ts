import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  readonly name: string;

  @IsNotEmpty({ message: 'Address không được để trống' })
  readonly address: string;
  @IsNotEmpty({ message: 'Description không được để trống' })
  readonly description: string;
}

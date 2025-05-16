import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company, CompanyDocument } from './dto/schemas/company.schema';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const createCompany = new this.companyModel(createCompanyDto);
    return createCompany.save();
  }

  findAll() {
    return this.companyModel.find();
  }

  findOne(id: string) {
    return this.companyModel.findById(id);
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.companyModel.findByIdAndUpdate(id, updateCompanyDto, {
      new: true,
    });
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'not found user';
    }
    return this.companyModel.softDelete({ _id: id });
  }
}

import { Injectable } from '@nestjs/common';
import { CreateDireetionDto } from './dto/create-direetion.dto';
import { UpdateDireetionDto } from './dto/update-direetion.dto';

@Injectable()
export class DireetionsService {
  create(createDireetionDto: CreateDireetionDto) {
    return 'This action adds a new direetion';
  }

  findAll() {
    return `This action returns all direetions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} direetion`;
  }

  update(id: number, updateDireetionDto: UpdateDireetionDto) {
    return `This action updates a #${id} direetion`;
  }

  remove(id: number) {
    return `This action removes a #${id} direetion`;
  }
}

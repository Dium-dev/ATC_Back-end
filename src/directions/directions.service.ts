import { Injectable } from '@nestjs/common';
import { CreateDireetionDto } from './dto/create-direetion.dto';
import { UpdateDireetionDto } from './dto/update-direetion.dto';
import { Direction } from './entities/direction.entity';

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

  async remove(id: string) {

    try {
      const direction = await Direction.findByPk(id);

      if (direction) {
          await direction.destroy();
          return { message: 'Direccion eliminada exitosamente' };
      } else {
          throw new Error('Direccion no encontrada');
      }
  } catch (error) {
      
      throw error;
  }
   
  }


  
}

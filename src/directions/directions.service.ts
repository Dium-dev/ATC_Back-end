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

  async update(id: string, updateDireetionDto: UpdateDireetionDto) {

    try{

      const direction = await Direction.findByPk(id)

      if(direction){

        if(updateDireetionDto.codigoPostal){
          direction.codigoPostal = updateDireetionDto.codigoPostal
        }

        if(updateDireetionDto.ciudad){
          direction.ciudad = updateDireetionDto.ciudad
        }

        if(updateDireetionDto.estado){
          direction.estado = updateDireetionDto.estado
        }

        if(updateDireetionDto.calle){
          direction.calle = updateDireetionDto.calle
        }

        await direction.save()

        return direction



      }else{
        throw new Error('direccion no encontrada')
      }

    }catch(error){
   
      throw error

    }


    
  }

  remove(id: number) {
    return `This action removes a #${id} direetion`;
  }
}

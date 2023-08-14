import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { IError } from 'src/utils/interfaces/error.interface';

@Injectable()
export class BrandsService {
  async findAllBrands(): Promise<{ id: string; name: string }[] | IError> {
    try {
      const allBrands = await Brand.findAll();
      if (!allBrands.length)
        throw new NotFoundException(
          'No se encontró ninguna marca en la base de datos',
        );
      return allBrands;
    } catch (error) {
      switch (error.constructor) {
        case NotFoundException:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(
            'Ocurrió un error al en el servidor al trabajar las Categorias',
          );
      }
    }
  }
}

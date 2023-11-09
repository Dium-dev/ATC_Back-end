import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  async findAllBrands(): Promise<{ id: string; name: string }[]> {
    try {
      const allBrands = await Brand.findAll();
      if (!allBrands.length)
        throw new NotFoundException(
          'No se encontró ninguna Marca en la base de datos',
        );
      return allBrands;
    } catch (error) {
      switch (error.constructor) {
        case NotFoundException:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(
            'Ocurrió un error al en el servidor al trabajar las Marcas',
          );
      }
    }
  }
}

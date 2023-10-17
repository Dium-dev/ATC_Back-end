import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categories } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  async findAllCategories(): Promise<{ id: string; name: string }[]> {
    try {
      const allCategories = await Categories.findAll();
      if (!allCategories.length)
        throw new NotFoundException(
          'No se encontró ninguna categoría en la base de datos',
        );
      return allCategories;
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

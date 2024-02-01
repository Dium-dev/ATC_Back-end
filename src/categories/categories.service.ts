import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Categories } from './entities/category.entity';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { API_KEY } from 'src/config/env';
import { InjectModel } from '@nestjs/sequelize';
import { ICategoriesData } from './interfaces/categoriesData.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Categories)
    private categoriesModel: typeof Categories,
  ) {}

  async findAllCategories(): Promise<Categories[]> {
    try {
      const allCategories = await this.categoriesModel.findAll();
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

  async getSheetsData(url: string): Promise<GoogleSpreadsheet> {
    try {
      if (!url.length)
        throw new BadRequestException(
          'No olvide indicarnos la URL del documento a trabajar.',
        );

      const sheetsId = url.split('/')[5];

      const miDoc = new GoogleSpreadsheet(sheetsId, { apiKey: API_KEY });

      await miDoc.loadInfo();

      return miDoc;
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException(
            `Hubo un problema al solicitar los datos a la URL: ${Object.values(
              url,
            )}\n${error.message}`,
          );
      }
    }
  }

  async spreadSheetsToJSON(
    Data: GoogleSpreadsheet,
  ): Promise<{ name: string }[]> {
    try {
      const miSheets = Data.sheetsByIndex[0];

      const rowValues = await miSheets.getCellsInRange('A:Z').then((res) =>
        res.flat().map((val: string) => {
          return {
            name: val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(),
          };
        }),
      );

      return rowValues;
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo problemas al indagar el archivo: Error ' + error.message,
      );
    }
  }

  async postInDatabase(data: { name: string }[]): Promise<void> {
    try {
      await this.categoriesModel.bulkCreate(data);
      return;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear las categorías en la base de datos.\nError: ${error.message}`,
      );
    }
  }

  async createOneCategory(name: string) {
    try {
      await this.categoriesModel.create({
        name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
      });
      return;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear la categoría en la base de datos.\nError: ${error.message}`,
      );
    }
  }

  async updateCategoryName(categorie: ICategoriesData) {
    try {
      await this.categoriesModel.update(
        {
          name:
            categorie.name.charAt(0).toUpperCase() +
            categorie.name.slice(1).toLowerCase(),
        },
        { where: { id: categorie.id } },
      );
      return;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar la categoría en la base de datos.\nError: ${error.message}`,
      );
    }
  }
}

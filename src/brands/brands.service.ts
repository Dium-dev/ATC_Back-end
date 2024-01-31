import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Brand } from './entities/brand.entity';
import { Op } from 'sequelize';
import { miCache } from 'src/utils/nodeCache/nodeCache';
import { ProductsService } from 'src/products/products.service';
import { InjectModel } from '@nestjs/sequelize';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { API_KEY } from 'src/config/env';
import { IBrandsData } from './interfaces/brandsData.interface';

@Injectable()
export class BrandsService {
  constructor(
    @Inject(forwardRef(() => ProductsService))
    private productService: ProductsService,
    @InjectModel(Brand)
    private brandsModel: typeof Brand,
  ) { }

  async findAllBrands(): Promise<Brand[]> {
    try {
      const allBrands = await this.brandsModel.findAll();
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

  public async findOneBrand(name: string) {
    try {
      const thisBrand = await this.brandsModel.findOne({
        where: { name: { [Op.eq]: name } },
      });
      if (thisBrand) {
        return thisBrand;
      } else {
        throw new NotFoundException(
          'No se encontró la Marca en la base de datos',
        );
      }
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

  public async postInCacheData() {
    try {
      const allBrands = await this.findOneBrand('Todas');
      miCache.set('AllBrands_Id', allBrands.id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrio un error con la cache del servidor',
      );
    }
  }


  async getSheetsData(url: string): Promise<GoogleSpreadsheet> {
    try {
      if (!url.length) throw new BadRequestException('No olvide indicarnos la URL del documento a trabajar.');

      const sheetsId = url.split('/')[5];

      const miDoc = new GoogleSpreadsheet(sheetsId, { apiKey: API_KEY });

      await miDoc.loadInfo();

      return miDoc;
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(error.message)
        default:
          throw new InternalServerErrorException(
            `Hubo un problema al solicitar los datos a la URL: ${Object.values(url)}\n${error.message}`,
          );
      }
    }
  }

  async spreadSheetsToJSON(
    Data: GoogleSpreadsheet,
  ): Promise<{ name: string }[]> {
    try {
      const miSheets = Data.sheetsByIndex[0];

      const rowValues = await miSheets.getCellsInRange('A:Z')
        .then((res) => res.flat().map((val: string) => { return { name: val } }))

      return rowValues;
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo problemas al indagar el archivo: Error ' + error.message,
      );
    }
  }

  async postInDatabase(data: { name: string }[]): Promise<void> {
    try {
      await this.brandsModel.bulkCreate(data);
      return;
    } catch (error) {
      throw new InternalServerErrorException(`Error al crear las marcas en la base de datos.\nError: ${error.message}`)
    }
  }

  async createOneBrand(name: string) {
    try {
      await this.brandsModel.create({ name: name });
      return;
    } catch (error) {
      throw new InternalServerErrorException(`Error al crear la marca en la base de datos.\nError: ${error.message}`)
    }
  }

  async updateBrandName(brand: IBrandsData) {
    try {
      await this.brandsModel.update(
        { name: brand.name },
        { where: { id: brand.id } }
      );
      return;
    } catch (error) {
      throw new InternalServerErrorException(`Error al actualizar la marca en la base de datos.\nError: ${error.message}`)
    }
  }


}

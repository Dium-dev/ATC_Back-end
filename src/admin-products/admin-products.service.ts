import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ExcelProductDto } from './dto/exelProducts.dto';
import axios from 'axios';

import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';

/* entities */
import { Product } from 'src/products/entities/product.entity';
import { Categories } from 'src/categories/entities/category.entity';
import { Brand } from 'src/brands/entities/brand.entity';

/* interface */
import { IResponseCreateOrUpdateProducts } from './interfaces/response-create-update.interface';

@Injectable()
export class AdminProductsService {
  //Usa una url al archivo original para obtener la información y retornar un buffer
  async getExcelData(url: string): Promise<Buffer> {
    try {
      const { data }: { data: Buffer } = await axios.get(url, {
        responseType: 'arraybuffer',
      });

      if (!data)
        throw new NotFoundException(
          `No se ha encontrado el contenido de la URL solicitada \'${url}\'`,
        );

      return data;
    } catch (error) {
      switch (error.constructor) {
        case NotFoundException:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(
            `Hubo un problema al solicitar los datos a la URL: ${url}`,
          );
      }
    }
  }

  excelToCsv(excelData: Buffer): string {
    try {
      //Parse a buffer wich contains the data to save in DB
      const workbook = XLSX.read(excelData, { type: 'buffer' });

      const sheetName = workbook.SheetNames[0];

      if (!sheetName)
        throw new ConflictException(
          'Hubo un problema a la hora de trabajár el Excel!. Recuerde ponerle un nombre a la hoja de trabajo',
        );

      const worksheet = workbook.Sheets[sheetName];

      if (!workbook)
        throw new ConflictException(
          'Hubo un problema a la hora de trabajár el Excel!. confirme que la hoja de trabajo esté guardada',
        );

      const csvData = XLSX.utils.sheet_to_csv(worksheet);

      return csvData;
    } catch (error) {
      switch (error.constructor) {
        case ConflictException:
          throw new ConflictException(error.message);
        default:
          throw new InternalServerErrorException(
            'Hubo un problema en el servidor al realizar la operación Excel => .csv',
          );
      }
    }
  }

  async csvToJson(csvData: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          resolve(result.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  private async findThisProduct(id: string): Promise<Product | null> {
    const thisProduct: Product | null = await Product.findByPk(id);
    return thisProduct;
  }

  private async createNewProduct(
    product: ExcelProductDto,
    index: number,
  ): Promise<void> {
    try {
      const categoryId = await this.getOrCreateInEntitis(
        Categories,
        product.Categoría,
        index,
      );

      const brandId = await this.getOrCreateInEntitis(
        Brand,
        product.Marca,
        index,
      );

      await Product.create({
        id: product['Número de publicación'],
        title: product.Título,
        description: product.Descripción,
        state: product.Estado,
        stock: Number(product.Stock),
        price: Number(product['Precio COP']),
        availability: Number(product['Disponibilidad de stock (días)']) || 0,
        image: [''],
        year: product.Título.split(' ')[3].includes('-')
          ? product.Título.split(' ')[3]
          : product.Título.split(' ')[4].includes('-')
            ? product.Título.split(' ')[4]
            : null,
        brandId: brandId,
        categoryId: categoryId,
      });

      return;
    } catch (error) {
      throw new InternalServerErrorException(
        `Ocurrió un problema en la creación del producto '${
          product.Título
        }', en el Indice: ${index + 2}`,
      );
    }
  }

  //Crea o actualiza un producto en DB
  async JsonToDatabase(
    allProducts: any[],
  ): Promise<IResponseCreateOrUpdateProducts> {
    for (const [index, value] of allProducts.entries()) {
      const thisProduct: Product | null = await this.findThisProduct(
        value['Número de publicación'],
      );

      if (thisProduct) {
        await this.updateProduct(thisProduct, value, index);
      } else {
        await this.createNewProduct(value, index);
      }
    }

    return {
      statusCode: 201,
      message: 'Productos creados / actualizados con éxito!',
    };
  }

  private async getOrCreateInEntitis(
    Entity: typeof Categories | typeof Brand,
    name: string,
    index: number,
  ): Promise<string> {
    try {
      const [thisResult]: [Categories | Brand, boolean] =
        await Entity.findOrCreate({
          where: { name },
        });

      if (!thisResult)
        throw new NotFoundException(
          `No se pudo encontrar entre las entidades a ${name}, en el Indice: ${
            index + 2
          }`,
        );

      return thisResult.id;
    } catch (error) {
      switch (error.constructor) {
        case NotFoundException:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(
            `Ocurrio un error al consultar la entidad ${Entity.tableName}`,
          );
      }
    }
  }

  private async updateProduct(
    thisProduct: Product,
    product: ExcelProductDto,
    index: number,
  ): Promise<void> {
    try {
      //Se obtiene o, de no existir, se crea una nueva categoría y luego retorna el id
      //Lo mismo se aplica para el Brand
      const categoryId: string = await this.getOrCreateInEntitis(
        Categories,
        product.Categoría,
        index,
      );

      const brandId: string = await this.getOrCreateInEntitis(
        Brand,
        product.Marca,
        index,
      );
      //Se actualiza el producto
      thisProduct.title = product.Título;
      thisProduct.description = product.Descripción;
      thisProduct.state = product.Estado;
      thisProduct.stock = Number(product.Stock);
      thisProduct.availability =
        Number(product['Disponibilidad de stock (días)']) || 0;
      thisProduct.image = [''];
      thisProduct.year = product.Título.split(' ')[3].includes('-')
        ? product.Título.split(' ')[3]
        : product.Título.split(' ')[4].includes('-')
          ? product.Título.split(' ')[4]
          : null;
      thisProduct.brandId = brandId;
      thisProduct.categoryId = categoryId;

      await thisProduct.save();

      return;
    } catch (error) {
      throw new InternalServerErrorException(
        `Ocurrio un error al Actualizar el producto ${
          product.Título
        }, en el Indice: ${index + 2}`,
      );
    }
  }
}

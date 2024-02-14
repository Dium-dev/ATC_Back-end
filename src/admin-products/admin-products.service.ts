import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { GoogleSpreadsheet } from 'google-spreadsheet';

/* entities */
import { Product } from 'src/products/entities/product.entity';
import { Categories } from 'src/categories/entities/category.entity';
import { Brand } from 'src/brands/entities/brand.entity';

/* DTOs */
import { SheetsProductDto } from './dto/sheetsProducts.dto';

/* interface */
import { IResponseCreateOrUpdateProducts } from './interfaces/response-create-update.interface';
import { ProductsService } from 'src/products/products.service';

/* .env Variable */
import { API_KEY } from 'src/config/env';
import { Op } from 'sequelize';
import {
  IProduct,
  IUpdateDataProduct,
} from './interfaces/updateDataProduct.interface';
import { IDeleteProductImage } from './dto/deleteProductImage.dto';
import { IDestroyedImagesResponse } from 'src/products/interfaces/destroyedImages.interfaces';

@Injectable()
export class AdminProductsService {
  constructor(
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {}

  async getSheetsData(url: string): Promise<GoogleSpreadsheet> {
    try {
      const sheetsId = url.split('/')[5];

      const miDoc = new GoogleSpreadsheet(sheetsId, { apiKey: API_KEY });

      await miDoc.loadInfo();

      return miDoc;
    } catch (error) {
      throw new InternalServerErrorException(
        `Hubo un problema al solicitar los datos a la URL: ${Object.values(
          url,
        )}`,
      );
    }
  }

  async spreadSheetsToJSON(
    Data: GoogleSpreadsheet,
  ): Promise<SheetsProductDto[]> {
    try {
      const miSheets = Data.sheetsByIndex[0];

      const rowValues = await miSheets.getCellsInRange('A:Z');
      const headers = rowValues[0];
      const objectContainer = [];

      for (const val of Object(rowValues.slice(1))) {
        const object = {};
        headers.forEach((header: string, index: number) => {
          object[header] = val[index] !== '' ? val[index] : undefined;
        });
        objectContainer.push(object);
      }
      return objectContainer;
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo problemas al indagar el archivo: Error ' + error.message,
      );
    }
  }

  private async createNewProduct(
    product: SheetsProductDto,
    index: number,
  ): Promise<void> {
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

    await this.productsService.createGenericProduct(
      product,
      brandId,
      categoryId,
      index,
    );

    return;
  }

  //Crea o actualiza un producto en DB
  async JsonToDatabase(
    allProducts: any[],
  ): Promise<IResponseCreateOrUpdateProducts> {
    const results = await Promise.allSettled(
      allProducts.map(async (value, index) => {
        const thisProduct: Product | null =
          await this.productsService.findByPkToValidateExistentProduct(
            value['Número de publicación'],
          );
        if (thisProduct) {
          await this.updateProduct(thisProduct, value, index);
        } else {
          await this.createNewProduct(value, index);
        }
      }),
    );
    let successful = 0;
    const errors = [];
    for await (const [index, value] of results.entries()) {
      if (value.status == 'fulfilled') {
        successful += 1;
      } else {
        errors.push({ index, reason: value.reason });
      }
    }

    return {
      statusCode: 201,
      message: 'Productos creados / actualizados con éxito!',
      successful,
      errors,
    };
  }

  private async getOrCreateInEntitis(
    Entity: typeof Categories | typeof Brand,
    name: string,
    index: number,
  ): Promise<string> {
    try {
      const thisResult: Categories | Brand = await Entity.findOne({
        where: { name: { [Op.iLike]: `%${name}%` } },
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
            `Ocurrio un error al consultar la entidad ${Entity.tableName}, con la categoria: ${name} del indice ${index}. Error: ` +
              error.message,
          );
      }
    }
  }

  private async updateProduct(
    thisProduct: Product,
    product: SheetsProductDto,
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
      thisProduct.price = Number(product['Precio COP']);
      thisProduct.availability =
        Number(product['Disponibilidad de stock (días)']) || 0;
      /* thisProduct.image = product.Fotos.split(',').map((img) => img.trim()); */
      (thisProduct.year = product.Año), (thisProduct.brandId = brandId);
      thisProduct.categoryId = categoryId;
      thisProduct.model = product.Modelo;

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

  async updateOneProduct(id: string, product: IUpdateDataProduct) {
    try {
      await this.productsService.updateProduct(product, { where: { id } }, id);
      return;
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException(error.message);
      }
    }
  }

  async postOneProduct(product: IProduct): Promise<void> {
    try {
      await this.productsService.createOneProduct(product);
      return;
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException(error.message);
      }
    }
  }

  async DeleteImages(
    dataProducts: IDeleteProductImage[],
  ): Promise<IDestroyedImagesResponse> {
    try {
      return await this.productsService.DeleteProductImages(dataProducts);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

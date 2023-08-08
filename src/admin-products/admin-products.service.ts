import { Injectable } from '@nestjs/common';
import { ExcelProductDto } from './dto/exelProducts.dto';
import { Op } from 'sequelize';
import axios from 'axios';

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as Papa from 'papaparse';

/* entities */
import { Product } from 'src/products/entities/product.entity';
import { Categories } from 'src/categories/entities/category.entity';
import { Brand } from 'src/brands/entities/brand.entity';

@Injectable()
export class AdminProductsService {

  async getExcelData(url: string) {
    const { data } = await axios.get(url, { responseType: 'arraybuffer' });
    return data;
  }

  async excelToCsv(excelData: Buffer): Promise<string> {
    try {
      const workbook = XLSX.read(excelData, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const csvData = XLSX.utils.sheet_to_csv(worksheet);

      fs.writeFileSync('archivo.csv', csvData);
      return csvData;
    } catch (error) {
      throw new Error('No se pudo convertir el archivo Excel a CSV.');
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

  async JsonToDatabase(allProducts: ExcelProductDto[]): Promise<{ message: string }> {
    for (const product of allProducts) {
      const thisProduct = await Product.findByPk(product['Número de publicación']);

      if (thisProduct) {
        await this.updateProduct(thisProduct, product);
      } else {
        const categoryId = await this.getCategory(product.Categoría);
        const brandId = await this.getBrand(product.Marca);

        await Product.create({
          id: product['Número de publicación'],
          title: product.Título,
          description: product.Descripción,
          state: product.Estado,
          stock: 0,
          availability: Number(product['Disponibilidad de stock (días)']) || 0,
          image: [''],
          year: product.Título.split(' ')[3].includes('-')
            ? product.Título.split(' ')[3]
            : product.Título.split(' ')[4].includes('-')
              ? product.Título.split(' ')[4]
              : null,
          brandId: brandId,
          categoryId: categoryId.dataValues.id,
        });
      }
    }

    return { message: 'todo ok' };
  }

  private async getCategory(categoria: string) {
    let category = await Categories.findOne({
      where: { name: { [Op.iLike]: `%${categoria}%` } },
      attributes: ['id'],
    });

    category = category || await Categories.create({ name: categoria });

    return category;
  }

  private async getBrand(brand: string) {
    let brandObj = await Brand.findOne({
      where: { name: { [Op.iLike]: `%${brand}%` } },
      attributes: ['id'],
    });

    brandObj = brandObj || await Brand.create({ name: brand });

    return brandObj.id;
  }

  private async updateProduct(thisProduct: any, product: any) {
    const categoryId = await this.getCategory(product.Categoría);
    const brandId = await this.getBrand(product.Marca);

    thisProduct.title = product.Título;
    thisProduct.description = product.Descripción;
    thisProduct.state = product.Estado;
    thisProduct.stock = 0;
    thisProduct.availability = Number(product['Disponibilidad de stock (días)']) || 0;
    thisProduct.image = [''];
    thisProduct.year = product.Título.split(' ')[3].includes('-')
      ? product.Título.split(' ')[3]
      : product.Título.split(' ')[4].includes('-')
        ? product.Título.split(' ')[4]
        : null;
    thisProduct.brandId = brandId;
    thisProduct.categoryId = categoryId.dataValues.id;
  

    await thisProduct.save();
  }

}

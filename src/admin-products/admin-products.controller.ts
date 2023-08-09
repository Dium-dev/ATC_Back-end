import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminProductsService } from './admin-products.service';

@Controller('admin-products')
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) { }

  @Post('')
  async excelToDataBase(@Body('url') url: string) {

    const excelData = await this.adminProductsService.getExcelData(url);
    
    const csvData = await this.adminProductsService.excelToCsv(excelData);

    const jsonData = await this.adminProductsService.csvToJson(csvData);

    return this.adminProductsService.JsonToDatabase(jsonData);

  }



}

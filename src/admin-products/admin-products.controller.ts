import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminProductsService } from './admin-products.service';

@Controller('admin-products')
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) { }

  @Post('')
  async excelToDataBase(@Body('url') url: string) {

    let excelData = await this.adminProductsService.getExcelData(url)
    
    let csvData = await this.adminProductsService.excelToCsv(excelData)

    let jsonData = await this.adminProductsService.csvToJson(csvData)

    return await this.adminProductsService.JsonToDatabase(jsonData)

  }



}

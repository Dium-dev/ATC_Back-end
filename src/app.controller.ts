import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /* recibe el mismo body que create user. lo dejo para tener una prueba de su funcionamiento
  pero despues me encargo de ir limpiando el codigo ! */
  /* @Post('register')
  async prueba(@Body() algo: any) {
    return await this.appService.postPrueba(algo)
  } */
}

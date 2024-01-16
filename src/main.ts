import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Categories } from './categories/entities/category.entity';
import { Brand } from './brands/entities/brand.entity';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FRONT_HOST, PORT } from './config/env';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: FRONT_HOST,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'x-token'],
    credentials: true,
  });
  app.use(morgan('dev'));
  app.useGlobalPipes(new ValidationPipe());
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const config = new DocumentBuilder()
    .setTitle('ATC_api')
    .setDescription('ATC api documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  console.log('Server raised in port:', PORT);
}
bootstrap().then(async () => {
  const allCategories: { id: string; name: string }[] =
    await Categories.findAll();
  const categories: { name: string }[] = [
    { name: 'Farolas' },
    { name: 'Stops' },
    { name: 'Radios' },
    { name: 'Exploradoras' },
    { name: 'Parrillas' },
    { name: 'Bompers' },
    { name: 'Bombillos' },
    { name: 'Spoilers' },
    { name: 'Accesorios' },
    { name: 'Repuestos' },
  ];

  allCategories.length ? null : await Categories.bulkCreate(categories);
  const brands: { name: string }[] = [
    { name: 'Acura' },
    { name: 'Alfa Romeo' },
    { name: 'Aston Martin' },
    { name: 'Audi' },
    { name: 'BMW' },
    { name: 'Cadillac' },
    { name: 'Chevrolet' },
    { name: 'Chrysler' },
    { name: 'Cupra' },
    { name: 'Citroën' },
    { name: 'Cupra' },
    { name: 'Daihatsu' },
    { name: 'Dodge' },
    { name: 'Ferrari' },
    { name: 'Fiat' },
    { name: 'Ford' },
    { name: 'Freightliner' },
    { name: 'GMC' },
    { name: 'Hino' },
    { name: 'Honda' },
    { name: 'Hummer' },
    { name: 'Hyundai' },
    { name: 'Infiniti' },
    { name: 'JAC' },
    { name: 'Jaguar' },
    { name: 'Jeep' },
    { name: 'Kenworth' },
    { name: 'Kia' },
    { name: 'Lamborghini' },
    { name: 'Land Rover' },
    { name: 'Lexus' },
    { name: 'Lincoln' },
    { name: 'Mac' },
    { name: 'Maserati' },
    { name: 'Mazda' },
    { name: 'McLaren' },
    { name: 'Mercedes Benz' },
    { name: 'MG' },
    { name: 'Mercury' },
    { name: 'Mini' },
    { name: 'Mitsubishi' },
    { name: 'Nissan' },
    { name: 'Peugeot' },
    { name: 'Pontiac' },
    { name: 'Porsche' },
    { name: 'RAM' },
    { name: 'Range Rover' },
    { name: 'Renault' },
    { name: 'Rover' },
    { name: 'Seat' },
    { name: 'Skoda' },
    { name: 'Ssangyong' },
    { name: 'Subaru' },
    { name: 'Suzuki' },
    { name: 'Tesla' },
    { name: 'Toyota' },
    { name: 'Volkswagen' },
    { name: 'Volvo' },
    { name: 'Todas' },
  ];
  const allBrands: { id: string; name: string }[] = await Brand.findAll();
  allBrands.length ? null : await Brand.bulkCreate(brands);
});

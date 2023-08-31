import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }


  @ApiOperation({ summary: 'Obtener ordenes' })
  @ApiResponse({
    status: 200,
    description: 'Ordenes obtenidas',
  })
  @ApiResponse({ status: 404, description: 'Ordenes no encontradas' })
  @ApiResponse({ status: 500, description: 'Error del servidor' })
  @ApiParam({
    name: 'id',
    description: 'id del usuario del que obtengo las ordenes',
    type: 'string',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.ordersService.findOne(id);
    return response;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}

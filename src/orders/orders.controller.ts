import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //Obtener una orden por id
  @ApiOperation({ summary: 'Obtener orden' })
  @ApiResponse({
    status: 200,
    description: 'Orden obtenida',
  })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @ApiResponse({ status: 500, description: 'Error del servidor' })
  @ApiParam({
    name: 'id',
    description: 'id de la orden que busco',
    type: 'string',
  })
  @Get(':id')
  async findOneOrder(@Param('id') id: string) {
    const response = await this.ordersService.findOneOrder(id);
    return response;
  }
}

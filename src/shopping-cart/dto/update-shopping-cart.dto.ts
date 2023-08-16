import { PartialType } from '@nestjs/swagger';
import { CreateShoppingCartDto } from './create-shopping-cart.dto';

export class UpdateShoppingCartDto extends PartialType(CreateShoppingCartDto) {}

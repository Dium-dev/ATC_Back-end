import { PartialType } from '@nestjs/swagger';
import { CreateDireetionDto } from './create-direetion.dto';

export class UpdateDireetionDto extends PartialType(CreateDireetionDto) {}

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsUUID } from 'class-validator';

export class ActivateReviewDto {
  @ApiProperty({
    description:
      'id de la reseña a desactivar o activar. Debe ser de tipo UUIDV4',
    type: 'string',
  })
  @IsUUID(4, {
    message: '$property must be a valid uuid version $constraint1',
  })
  //reviewId
    reviewId: string;

  @ApiProperty({
    type: 'boolean',
    description: 'Falso para "borrar" y true para "desborrar" XD',
  })
  @IsBoolean({
    message: '$property debe ser de tipo booleano, en cambio enviaste $value',
  })
  //activate
    activate: boolean;
}

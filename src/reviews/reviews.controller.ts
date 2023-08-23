import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ActivateReviewDto } from './dto/activate-review.dto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiFoundResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  //El id viene por parámetro solo en la versión de desarroll. Ccuando se agreguen los guards
  // No será necesario un parámetro, así que no le hagas docu al id, Ok?
  @Post('/:id')
  @ApiOperation({ summary: 'Crea una nueva reseña' })
  @ApiNotFoundResponse({ description:'Sucede cuando el usuario no existe' })
  @ApiCreatedResponse({ description:'Se creó la reseña de forma exitosa' })
  @ApiBadRequestResponse({ description:'No se pudo crear la reseña, se sugiere revisar la información del body' })
  @ApiInternalServerErrorResponse({ description: 'Algo salió mal en el servidor, se sugiere revisar que el usuario en cuestión no tenga un review creado aún' })
  @ApiBody({ type: CreateReviewDto })
  create(@Param('id') id:string, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(id, createReviewDto);
  }

  @Get()
  @ApiOperation({ summary:'Obtiene todos los reviews no borrados(borrado lógico)' })
  @ApiFoundResponse({ description: 'Cuando todo salga bien obtendrás este statusCode junto con todos los reviews' })
  @ApiNotFoundResponse({ description: 'Por si no hay reseñas activas en este momento' })
  @ApiInternalServerErrorResponse({ description: 'Hubo un problema en el servidor' })
  findAll() {
    return this.reviewsService.findAll();
  }

  @Patch('update')
  @ApiBody({ type: UpdateReviewDto })
  @ApiOperation({ summary:'Actualiza un review' })
  @ApiOkResponse({ description: 'Si todo sale bien, obtendrás la review editada con los nuevos datos' })
  @ApiNotFoundResponse({ description:'Cuando no existe la reseña que se está editando' })
  @ApiInternalServerErrorResponse({ description: 'Hubo un error en el servidor al momento de actualizar la review. Revisa una vez más los datos enviados' })
  update(@Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(updateReviewDto);
  }

  @Patch('activate')
  @ApiBody({ type: ActivateReviewDto })
  @ApiOperation({ summary:'Activa o desactiva un review(borrado lógico)' })
  @ApiInternalServerErrorResponse({ description:'Hubo un error al momento de actualizar la reseña' })
  @ApiOkResponse({ description: 'Si todo sale bien, obtendrás el número de reviews actualizadas' })
  remove(@Body() activateReview: ActivateReviewDto) {
    return this.reviewsService.removeOrActivate(activateReview); 
  }
}

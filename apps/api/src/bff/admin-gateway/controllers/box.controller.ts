import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { BoxApiService } from '../../../box/application/services/box-api.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBoxDto } from '../dtos/create-box.dto';

@ApiTags('Admin Boxes')
@Controller('admin/boxes')
export class BoxController {
  constructor(private readonly boxApiService: BoxApiService) {}

  @ApiBearerAuth('admin-auth')
  @ApiOperation({ summary: 'Creates the new box' })
  @ApiResponse({
    status: 201,
    description: 'Box created successfully',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBox(@Body() payload: CreateBoxDto) {
    return this.boxApiService.createBox(payload.title);
  }
}

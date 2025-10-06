import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetAdminUsersListQueryDto {
  @ApiProperty({ required: false, description: 'Take count' })
  @IsOptional()
  readonly take: number = 10;

  @ApiProperty({ required: false, description: 'Page count' })
  @IsOptional()
  readonly page: number = 1;
}

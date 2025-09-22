import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Refresh token',
  })
  @IsNotEmpty()
  readonly refreshToken: string;
}

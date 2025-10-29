import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetUpDailyGoalDto {
  @ApiProperty({
    description: 'Daily goal',
    example: 20,
  })
  @IsNumber()
  @IsPositive()
  readonly goal: number;
}

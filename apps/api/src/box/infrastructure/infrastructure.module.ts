import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { BoxRepository } from '../application/ports/box.repository';
import { PrismaBoxRepository } from './prisma/prisma-box.repository';
import { BeginBoxRepository } from '../application/ports/begin-box.repository';
import { PrismaBeginBoxRepository } from './prisma/prisma-begin-box.repository';
import { ClockModule } from '../../common/clock/clock.module';
import { DailyLearnedBoxRepository } from '../application/ports/daily-learned-box.repository';
import { PrismaDailyLearnedBoxRepository } from './prisma/prisma-daily-learned-box.repository';

@Module({
  imports: [PrismaModule, ClockModule],
  providers: [
    {
      provide: BoxRepository,
      useClass: PrismaBoxRepository,
    },
    {
      provide: BeginBoxRepository,
      useClass: PrismaBeginBoxRepository,
    },
    {
      provide: DailyLearnedBoxRepository,
      useClass: PrismaDailyLearnedBoxRepository,
    },
  ],
  exports: [BoxRepository, BeginBoxRepository, DailyLearnedBoxRepository],
})
export class InfrastructureModule {}

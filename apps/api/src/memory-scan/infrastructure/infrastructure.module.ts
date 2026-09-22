import { Module } from '@nestjs/common';
import { ClearMemoryScanDataCron } from './clear-memory-scan-data.cron';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { ClockModule } from '../../common/clock/clock.module';

@Module({
  imports: [PrismaModule, ClockModule],
  providers: [ClearMemoryScanDataCron],
})
export class InfrastructureModule {}

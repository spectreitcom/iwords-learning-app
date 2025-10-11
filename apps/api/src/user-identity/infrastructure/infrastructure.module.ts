import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [],
  exports: [],
})
export class InfrastructureModule {}

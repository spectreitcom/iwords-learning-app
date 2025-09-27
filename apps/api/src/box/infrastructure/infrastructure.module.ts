import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { BoxRepository } from '../application/ports/box.repository';
import { PrismaBoxRepository } from './prisma/prisma-box.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: BoxRepository,
      useClass: PrismaBoxRepository,
    },
  ],
  exports: [BoxRepository],
})
export class InfrastructureModule {}

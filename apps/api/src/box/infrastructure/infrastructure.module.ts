import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { BoxRepository } from '../application/ports/box.repository';
import { PrismaBoxRepository } from './prisma/prisma-box.repository';
import { BeginBoxRepository } from '../application/ports/begin-box.repository';
import { PrismaBeginBoxRepository } from './prisma/prisma-begin-box.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: BoxRepository,
      useClass: PrismaBoxRepository,
    },
    {
      provide: BeginBoxRepository,
      useClass: PrismaBeginBoxRepository,
    },
  ],
  exports: [BoxRepository, BeginBoxRepository],
})
export class InfrastructureModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { HashingService } from '../application/ports/hashing.service';
import { ArgonHashingService } from './services/argon-hashing.service';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: HashingService,
      useClass: ArgonHashingService,
    },
  ],
  exports: [HashingService],
})
export class AdminUserModule {}

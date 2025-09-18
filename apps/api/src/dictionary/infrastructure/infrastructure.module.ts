import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { ExpressionRepository } from '../application/ports/expression.repository';
import { PrismaExpressionRepository } from './repositories/prisma-expression.repository';
import { ExpressionValidationService } from '../application/ports/expression-validation.service';
import { AppExpressionValidationService } from './services/app-expression-validation.service';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: ExpressionRepository,
      useClass: PrismaExpressionRepository,
    },
    {
      provide: ExpressionValidationService,
      useClass: AppExpressionValidationService,
    },
  ],
  exports: [ExpressionRepository, ExpressionValidationService],
})
export class InfrastructureModule {}

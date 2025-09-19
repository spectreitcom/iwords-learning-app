import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { ExpressionRepository } from '../application/ports/expression.repository';
import { PrismaExpressionRepository } from './repositories/prisma-expression.repository';
import { ExpressionValidationService } from '../application/ports/expression-validation.service';
import { AppExpressionValidationService } from './services/app-expression-validation.service';
import { ExpressionContextRepository } from '../application/ports/expression-context.repository';
import { PrismaExpressionContextRepository } from './repositories/prisma-expression-context.repository';

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
    {
      provide: ExpressionContextRepository,
      useClass: PrismaExpressionContextRepository,
    },
  ],
  exports: [
    ExpressionRepository,
    ExpressionValidationService,
    ExpressionContextRepository,
  ],
})
export class InfrastructureModule {}

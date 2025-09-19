import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { ExpressionRepository } from '../application/ports/expression.repository';
import { PrismaExpressionRepository } from './repositories/prisma-expression.repository';
import { ExpressionValidationService } from '../application/ports/expression-validation.service';
import { AppExpressionValidationService } from './services/app-expression-validation.service';
import { ExpressionContextRepository } from '../application/ports/expression-context.repository';
import { PrismaExpressionContextRepository } from './repositories/prisma-expression-context.repository';
import { SentenceRepository } from '../application/ports/sentece.repository';
import { PrismaSentenceRepository } from './repositories/prisma-sentece.repository';
import { ExpressionContextValidationService } from '../application/ports/expression-context-validation.service';
import { AppExpressionContextValidationService } from './services/app-expression-context-validation.service';

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
    {
      provide: SentenceRepository,
      useClass: PrismaSentenceRepository,
    },
    {
      provide: ExpressionContextValidationService,
      useClass: AppExpressionContextValidationService,
    },
  ],
  exports: [
    ExpressionRepository,
    ExpressionValidationService,
    ExpressionContextRepository,
    SentenceRepository,
    ExpressionContextValidationService,
  ],
})
export class InfrastructureModule {}

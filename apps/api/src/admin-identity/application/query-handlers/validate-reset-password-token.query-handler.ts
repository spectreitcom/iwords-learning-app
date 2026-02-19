import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ValidateResetPasswordTokenQuery } from '../queries/validate-reset-password-token.query';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ResetPasswordTokensStorage } from '../ports/reset-password-tokens.storage';

export type ValidateResetPasswordTokenQueryResponse = { valid: boolean };

@QueryHandler(ValidateResetPasswordTokenQuery)
export class ValidateResetPasswordTokenQueryHandler implements IQueryHandler<
  ValidateResetPasswordTokenQuery,
  ValidateResetPasswordTokenQueryResponse
> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly resetTokensStorage: ResetPasswordTokensStorage,
  ) {}

  async execute(
    query: ValidateResetPasswordTokenQuery,
  ): Promise<ValidateResetPasswordTokenQueryResponse> {
    const { token } = query;

    const adminUser = await this.prismaService.adminUser.findFirst({
      where: {
        resetPasswordToken: token,
      },
    });

    if (!adminUser) return { valid: false };

    const isTokenValid = await this.resetTokensStorage.validate(adminUser.id);

    if (!isTokenValid) return { valid: false };

    return { valid: true };
  }
}

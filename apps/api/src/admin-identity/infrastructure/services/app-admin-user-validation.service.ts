import { Injectable } from '@nestjs/common';
import { AdminUserValidationService } from '../../application/ports/admin-user-validation.service';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { PrismaTx } from '../../../common/types';

@Injectable()
export class AppAdminUserValidationService implements AdminUserValidationService {
  constructor(private readonly prismaService: PrismaService) {}

  async isEmailTaken(email: string, tx?: PrismaTx): Promise<boolean> {
    const prisma = tx ?? this.prismaService;

    const adminUser = await prisma.adminUser.findUnique({
      where: {
        email,
      },
    });
    return !!adminUser;
  }

  async isSuperUser(adminUserId: string, tx?: PrismaTx): Promise<boolean> {
    const prisma = tx ?? this.prismaService;

    const adminUser = await prisma.adminUser.findUnique({
      where: {
        id: adminUserId,
      },
    });
    return adminUser?.isSuperuser ?? false;
  }
}

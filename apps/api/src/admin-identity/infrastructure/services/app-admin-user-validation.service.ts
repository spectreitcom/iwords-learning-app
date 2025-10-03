import { Injectable } from '@nestjs/common';
import { AdminUserValidationService } from '../../application/ports/admin-user-validation.service';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class AppAdminUserValidationService
  implements AdminUserValidationService
{
  constructor(private readonly prismaService: PrismaService) {}

  async isEmailTaken(email: string): Promise<boolean> {
    const adminUser = await this.prismaService.adminUser.findUnique({
      where: {
        email,
      },
    });
    return !!adminUser;
  }

  async isSuperUser(adminUserId: string): Promise<boolean> {
    const adminUser = await this.prismaService.adminUser.findUnique({
      where: {
        id: adminUserId,
      },
    });
    return adminUser?.blocked ?? true;
  }
}

import { Injectable } from '@nestjs/common';
import { AdminUserRepository } from '../../application/ports/admin-user.repository';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AdminUser } from '../../domain/admin-user';
import { AdminUserId } from '../../domain/value-objects/admin-user-id';
import { AdminUserEmail } from '../../domain/value-objects/admin-user-email';

@Injectable()
export class PrismaAdminUserRepository implements AdminUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(adminUser: AdminUser): Promise<void> {
    await this.prismaService.adminUser.upsert({
      where: { id: adminUser.getAdminUserId().value },
      update: {
        email: adminUser.getEmail().value,
        name: adminUser.getName(),
        password: adminUser.getHashedPassword(),
        isSuperuser: adminUser.getIsSuperuser(),
        blocked: adminUser.getBlocked(),
      },
      create: {
        id: adminUser.getAdminUserId().value,
        email: adminUser.getEmail().value,
        name: adminUser.getName(),
        password: adminUser.getHashedPassword(),
        isSuperuser: adminUser.getIsSuperuser(),
      },
    });
  }

  async findById(adminUserId: string): Promise<AdminUser | null> {
    const adminUserData = await this.prismaService.adminUser.findUnique({
      where: { id: adminUserId },
    });

    if (!adminUserData) {
      return null;
    }

    return new AdminUser(
      AdminUserId.fromString(adminUserData.id),
      AdminUserEmail.fromString(adminUserData.email),
      adminUserData.name,
      adminUserData.password,
      adminUserData.isSuperuser,
      adminUserData.blocked,
    );
  }

  async findByEmail(email: string): Promise<AdminUser | null> {
    const adminUserData = await this.prismaService.adminUser.findUnique({
      where: { email },
    });
    if (!adminUserData) return null;

    return new AdminUser(
      AdminUserId.fromString(adminUserData.id),
      AdminUserEmail.fromString(adminUserData.email),
      adminUserData.name,
      adminUserData.password,
      adminUserData.isSuperuser,
      adminUserData.blocked,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { AdminUserRepository } from '../../application/ports/admin-user.repository';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AdminUser } from '../../domain/admin-user';
import { AdminUserId } from '../../domain/value-objects/admin-user-id';
import { AdminUserEmail } from '../../domain/value-objects/admin-user-email';
import { PrismaTx } from '../../../common/types';

@Injectable()
export class PrismaAdminUserRepository implements AdminUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(adminUser: AdminUser, tx?: PrismaTx): Promise<void> {
    const prisma = tx ?? this.prismaService;
    await prisma.adminUser.upsert({
      where: { id: adminUser.getAdminUserId().value },
      update: {
        email: adminUser.getEmail().value,
        name: adminUser.getName(),
        password: adminUser.getHashedPassword(),
        isSuperuser: adminUser.getIsSuperuser(),
        blocked: adminUser.getBlocked(),
        resetPasswordToken: adminUser.getResetPasswordToken(),
      },
      create: {
        id: adminUser.getAdminUserId().value,
        email: adminUser.getEmail().value,
        name: adminUser.getName(),
        password: adminUser.getHashedPassword(),
        isSuperuser: adminUser.getIsSuperuser(),
        resetPasswordToken: adminUser.getResetPasswordToken(),
      },
    });
  }

  async findById(
    adminUserId: string,
    tx?: PrismaTx,
  ): Promise<AdminUser | null> {
    const prisma = tx ?? this.prismaService;

    const adminUserData = await prisma.adminUser.findUnique({
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
      adminUserData.resetPasswordToken,
    );
  }

  async findByEmail(email: string, tx?: PrismaTx): Promise<AdminUser | null> {
    const prisma = tx ?? this.prismaService;

    const adminUserData = await prisma.adminUser.findUnique({
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
      adminUserData.resetPasswordToken,
    );
  }

  async findByResetPasswordToken(
    token: string,
    tx?: PrismaTx,
  ): Promise<AdminUser | null> {
    const prisma = tx ?? this.prismaService;

    const adminUserData = await prisma.adminUser.findFirst({
      where: {
        resetPasswordToken: token,
      },
    });

    if (!adminUserData) return null;

    return new AdminUser(
      AdminUserId.fromString(adminUserData.id),
      AdminUserEmail.fromString(adminUserData.email),
      adminUserData.name,
      adminUserData.password,
      adminUserData.isSuperuser,
      adminUserData.blocked,
      adminUserData.resetPasswordToken,
    );
  }
}

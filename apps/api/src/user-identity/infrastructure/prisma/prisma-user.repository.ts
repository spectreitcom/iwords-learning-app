import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../appliaction/ports/user.repository';
import { User } from 'src/user-identity/domain/user';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { UserId } from '../../domain/value-objects/user-id';
import { UserEmail } from '../../domain/value-objects/user-email';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.getUserId().value },
      update: {
        clerkId: user.getClerkId(),
        email: user.getEmail().value,
        name: user.getName(),
        blocked: user.getBlocked(),
        provider: user.getProvider(),
      },
      create: {
        id: user.getUserId().value,
        clerkId: user.getClerkId(),
        email: user.getEmail().value,
        name: user.getName(),
        blocked: user.getBlocked(),
        provider: user.getProvider(),
      },
    });
  }

  async findById(userId: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!prismaUser) {
      return null;
    }

    return new User(
      UserId.fromString(prismaUser.id),
      prismaUser.clerkId,
      UserEmail.fromString(prismaUser.email),
      prismaUser.name,
      prismaUser.blocked,
      prismaUser.provider,
    );
  }
}

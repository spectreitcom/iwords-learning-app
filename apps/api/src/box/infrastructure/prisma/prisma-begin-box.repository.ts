import { Injectable } from '@nestjs/common';
import { BeginBoxRepository } from '../../application/ports/begin-box.repository';
import { BeginBox } from 'src/box/domain/begin-box';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class PrismaBeginBoxRepository implements BeginBoxRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(beginBox: BeginBox): Promise<void> {
    await this.prismaService.beginBox.create({
      data: {
        id: beginBox.getBeginBoxId().value,
        userId: beginBox.getUserId().value,
        boxId: beginBox.getBoxId().value,
      },
    });
  }

  async exists(userId: string, boxId: string): Promise<boolean> {
    const record = await this.prismaService.beginBox.findUnique({
      where: {
        userId_boxId: { userId, boxId },
      },
      select: { id: true },
    });

    return !!record;
  }
}

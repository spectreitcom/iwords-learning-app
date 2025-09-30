import { Injectable } from '@nestjs/common';
import { BoxRepository } from '../../application/ports/box.repository';
import { Box } from 'src/box/domain/box';
import { BoxId } from 'src/box/domain/value-objects/box-id';
import { ExpressionContextId } from 'src/box/domain/value-objects/expression-context-id';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class PrismaBoxRepository implements BoxRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(box: Box): Promise<void> {
    const boxId = box.getBoxId().value;
    const title = box.getTitle();
    const expressionContextIds = box
      .getExpressionContextIds()
      .map((id) => id.value);

    await this.prismaService.box.upsert({
      where: { id: boxId },
      update: {
        title,
        expressionContextIds,
      },
      create: {
        id: boxId,
        title,
        expressionContextIds,
      },
    });
  }

  async findById(boxId: string): Promise<Box | null> {
    const boxRecord = await this.prismaService.box.findUnique({
      where: { id: boxId },
    });

    if (!boxRecord) {
      return null;
    }

    const boxIdValueObject = BoxId.fromString(boxRecord.id);
    const expressionContextIds = boxRecord.expressionContextIds.map((id) =>
      ExpressionContextId.fromString(id),
    );

    return new Box(boxIdValueObject, boxRecord.title, expressionContextIds);
  }

  async delete(boxId: string): Promise<void> {
    await this.prismaService.box.delete({
      where: { id: boxId },
    });
  }
}

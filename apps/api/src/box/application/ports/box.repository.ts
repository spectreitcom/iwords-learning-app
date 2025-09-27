import { Box } from '../../domain/box';

export abstract class BoxRepository {
  abstract save(box: Box): Promise<void>;
  abstract findById(boxId: string): Promise<Box | null>;
}

import { Box } from '../../domain/box';

export abstract class BoxRepository {
  abstract save(box: Box): Promise<void>;
  abstract findById(boxId: string): Promise<Box | null>;
  abstract delete(boxId: string): Promise<void>;
}

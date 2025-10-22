import { BeginBox } from '../../domain/begin-box';

export abstract class BeginBoxRepository {
  abstract save(beginBox: BeginBox): Promise<void>;
  abstract exists(userId: string, boxId: string): Promise<boolean>;
}

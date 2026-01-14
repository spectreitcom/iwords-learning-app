import { DailyLearnedBox } from '../../domain/daily-learned-box';
import { PrismaTx } from '../../../common/types';

export abstract class DailyLearnedBoxRepository {
  abstract save(dailyLearnedBox: DailyLearnedBox, tx?: PrismaTx): Promise<void>;
  abstract findForToday(
    boxId: string,
    userId: string,
    tx?: PrismaTx,
  ): Promise<DailyLearnedBox | null>;
}

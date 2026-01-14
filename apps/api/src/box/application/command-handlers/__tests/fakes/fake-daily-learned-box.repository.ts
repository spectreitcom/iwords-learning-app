import { DailyLearnedBoxRepository } from '../../../ports/daily-learned-box.repository';
import { DailyLearnedBox } from '../../../../domain/daily-learned-box';
import { Clock } from '../../../../../common/clock/clock';
import { DailyLearnedBoxId } from '../../../../domain/value-objects/daily-learned-box-id';
import { UserId } from '../../../../domain/value-objects/user-id';
import { BoxId } from '../../../../domain/value-objects/box-id';

type FakeDailyLearnedBoxModel = {
  id: string;
  userId: string;
  boxId: string;
  createdAt: Date;
};

export class FakeDailyLearnedBoxRepository extends DailyLearnedBoxRepository {
  private readonly data = new Map<string, FakeDailyLearnedBoxModel>();

  constructor(private readonly clock: Clock) {
    super();
  }

  async findForToday(
    boxId: string,
    userId: string,
  ): Promise<DailyLearnedBox | null> {
    const today = this.clock.today().getTime();

    const record = Array.from(this.data.values()).find(
      (item) =>
        item.boxId === boxId &&
        item.userId === userId &&
        item.createdAt.getTime() === today,
    );

    if (!record) {
      return null;
    }

    return new DailyLearnedBox(
      DailyLearnedBoxId.fromString(record.id),
      UserId.fromString(record.userId),
      BoxId.fromString(record.boxId),
    );
  }

  async save(dailyLearnedBox: DailyLearnedBox): Promise<void> {
    this.data.set(dailyLearnedBox.getDailyLearnedBoxId().value, {
      id: dailyLearnedBox.getDailyLearnedBoxId().value,
      userId: dailyLearnedBox.getUserId().value,
      boxId: dailyLearnedBox.getBoxId().value,
      createdAt: this.clock.today(),
    });
  }
}

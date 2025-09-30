import { BoxView } from '../../view/box.view';

export abstract class BoxApi {
  abstract createBox(title: string): Promise<void>;
  abstract getBoxById(boxId: string): Promise<BoxView>;
}

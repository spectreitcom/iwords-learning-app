export abstract class BoxApi {
  abstract createBox(title: string): Promise<void>;
}

export class ScanResultView {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly itemsCount: number,
    public readonly rememberedItemsCount: number,
    public readonly rememberingTime: number,
    public readonly createdAt: Date,
  ) {}
}

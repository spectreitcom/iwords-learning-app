export class GetBoxesListQuery {
  constructor(
    public readonly take: number,
    public readonly page: number,
  ) {}
}

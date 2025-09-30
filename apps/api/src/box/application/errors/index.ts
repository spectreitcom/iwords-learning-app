export class BoxNotFoundError extends Error {
  constructor(boxId: string) {
    super(`BoxNotFoundError: ${boxId}`);
  }
}

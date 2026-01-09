export abstract class GenerateRepetitionService {
  abstract generate(userId: string): Promise<string[]>;
}

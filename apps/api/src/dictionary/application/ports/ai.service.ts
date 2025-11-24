export abstract class AiService {
  abstract generateDefinition(
    phrase: string,
    translation: string,
  ): Promise<{ definition: string; translation: string }>;
}

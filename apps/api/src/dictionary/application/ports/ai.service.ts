export abstract class AiService {
  abstract generateDefinition(
    phrase: string,
    translation: string,
  ): Promise<{ definition: string; translation: string }>;

  abstract generateSentences(
    phrase: string,
    translation: string,
  ): Promise<{ sentence: string; translation: string }[]>;
}

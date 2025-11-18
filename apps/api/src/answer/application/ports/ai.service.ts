export abstract class AiService {
  abstract validateSentence(
    phrase: string,
    translation: string,
    type: string,
    userSentence: string,
  ): Promise<{ score: number; answer: string }>;
}

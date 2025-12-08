import { Injectable } from '@nestjs/common';
import { AiService } from '../application/ports/ai.service';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';

const validateSentenceSchema = z.object({
  score: z.number(),
  answer: z.string(),
});

@Injectable()
export class OpenaiAiService implements AiService {
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      baseURL: this.configService.get<string>('OPENAI_BASE_URL')!,
      apiKey: this.configService.get<string>('OPENAI_API_KEY')!,
    });
  }

  async validateSentence(
    phrase: string,
    translation: string,
    type: string,
    userSentence: string,
  ): Promise<{ score: number; answer: string }> {
    const res = await this.client.chat.completions.create({
      model: this.configService.get<string>('OPENAI_MODEL')!,
      messages: [
        {
          role: 'user',
          content: `Jesteś nauczycielem języka angielskiego. 
            Sparawdź zdanie: „${userSentence}” pod kątem gramatyki i ogólnej zgodności z językiem angielskim.
            Zwróć szczególną uwagę na użycie słówka ${phrase} (${type}) - ${translation}. 
            Odpwiedź ma być zwięzła oraz w formacie json {score: <number>, answer: <string>} oraz w języku polskim. Nie używaj znaczników markdown w odpowiedzi. 
            Score ma być 1.0 jeżeli wszystko jest wporządku. Jeżeli znajdzie się drobny błąd to score 0.8, a jeżeli odpwiedź jest błędna to odpowiednio niższy score.`,
        },
      ],
      stream: false,
    });

    const parsed: unknown = JSON.parse(
      res.choices[0].message
        .content!.replace('```json', '')
        .replace('```', '')
        .trim(),
    );

    const validationResult = validateSentenceSchema.safeParse(parsed);

    if (!validationResult.success) {
      throw new Error('Invalid Response');
    }

    return validationResult.data;
  }
}

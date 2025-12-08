import { Injectable } from '@nestjs/common';
import { AiService } from '../../application/ports/ai.service';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';

const generateDefinitionSchema = z.object({
  definition: z.string(),
  translation: z.string(),
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

  async generateDefinition(
    phrase: string,
    translation: string,
  ): Promise<{ definition: string; translation: string }> {
    const res = await this.client.chat.completions.create({
      model: this.configService.get<string>('OPENAI_MODEL')!,
      stream: false,
      messages: [
        {
          role: 'user',
          content: `jesteś nauczycielem języka angielskiego. 
                    Tutaj masz wyrażenie „${phrase} - ${translation}”. 
                    Napisz mi wyczerpującą definicję dla tego wyrażenia w wyżej wymienionym kontekście. 
                    Odpowiedź wygeneruj w formacie json: {definition: <definicja po angielsku>, translation: <definicja po polsku>}.`,
        },
      ],
    });

    const parsed: unknown = JSON.parse(
      res.choices[0].message
        .content!.replace('```json', '')
        .replace('```', '')
        .trim(),
    );

    const validationResult = generateDefinitionSchema.safeParse(parsed);

    if (!validationResult.success) {
      throw new Error('Invalid Response');
    }

    return validationResult.data;
  }
}

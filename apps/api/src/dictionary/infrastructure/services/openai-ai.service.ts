import { Injectable } from '@nestjs/common';
import { AiService } from '../../application/ports/ai.service';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

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

    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Invalid Response');
    }

    const maybe = parsed as { definition?: unknown; translation?: unknown };

    if (
      typeof maybe.definition !== 'string' ||
      typeof maybe.translation !== 'string'
    ) {
      throw new Error('Invalid Response');
    }

    return { definition: maybe.definition, translation: maybe.translation };
  }
}

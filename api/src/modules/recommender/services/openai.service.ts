import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenaiService {
  private readonly openaiClient: OpenAIApi;

  constructor(private readonly configService: ConfigService) {
    const configuration = new Configuration({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.openaiClient = new OpenAIApi(configuration);
  }

  public async testChat(): Promise<string> {
    const chatCompletion = await this.openaiClient.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello world' }],
    });

    const message = chatCompletion.data.choices[0].message.content;

    return message;
  }
}

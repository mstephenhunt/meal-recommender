import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { RequestCacheService } from '../../utils/services/request-cache.service';

@Injectable()
export class OpenaiService {
  private readonly apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly requestCacheService: RequestCacheService,
  ) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
  }

  public async testChat(): Promise<string> {
    const response = await this.httpService
      .post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Say this is a test!' }],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      )
      .toPromise();

    await this.requestCacheService.cacheAxiosRequestResponse(response);

    return response.data;
  }
}

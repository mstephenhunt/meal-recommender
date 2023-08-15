import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { RequestCacheService } from '../../utils/services/request-cache.service';
import { lastValueFrom } from 'rxjs';
import {
  OpenAIMessage,
  SuggestNextMealInput,
  Meal,
  OpenAIRole,
} from '../types';

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

  public async requestRecipe(input: { recipeName: string }): Promise<Meal> {
    const initializeMessage = {
      role: OpenAIRole.SYSTEM,
      content: `Please provide a recipe for ${input.recipeName} in the JSON format of { "name": "meal name", "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": "instructions" }`,
    };

    const response = (await this.sendMessage([
      initializeMessage,
    ])) as unknown as Meal;

    return response;
  }

  public async suggestNextMeal(input: SuggestNextMealInput): Promise<Meal> {
    const initializeMessage = {
      role: OpenAIRole.SYSTEM,
      content: `You will be provided a list of meals with their ingredients and instructions. Please choose a ${input.type} meal 
      to cook next. This should be in the JSON format of { "name": "meal name", "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": "instructions" }`,
    };

    const previousMealMessages = input.meals.map((meal) => ({
      role: OpenAIRole.SYSTEM,
      content: JSON.stringify(meal),
    }));

    const response = (await this.sendMessage([
      initializeMessage,
      ...previousMealMessages,
    ])) as unknown as Meal;

    return response;
  }

  private async sendMessage(messages: OpenAIMessage[]): Promise<object> {
    const streamResponse = await this.httpService.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
      },
    );
    const response = await lastValueFrom(streamResponse);

    await this.requestCacheService.cacheAxiosRequestResponse(response);

    return response.data.choices[0].message.content;
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

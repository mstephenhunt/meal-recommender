import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { RequestCacheService } from '../../utils/services/request-cache.service';
import { lastValueFrom } from 'rxjs';
import {
  OpenAIMessage,
  SuggestNextMealInput,
  OpenAIMeal,
  OpenAIRole,
} from '../types';
import { Logger } from 'nestjs-pino';

@Injectable()
export class OpenaiService {
  private readonly apiKey: string;
  private readonly responseFormat = `
    Have your message return in the format of JSON 
      { 
        "name": "meal name", 
        "ingredients": [
          "name": "flour", 
          "quantity": 0.5, 
          "unit": "cup"
        ],
        "instructions": "instructions" 
      }
    Ensure none of the quantity values are fractional, they should all be decimal fields.
    Ensure that the JSON is parseable via JSON.parse().`;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly requestCacheService: RequestCacheService,
    private readonly logger: Logger,
  ) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
  }

  public async requestRecipe(input: {
    recipeName: string;
  }): Promise<OpenAIMeal> {
    const initializeMessage = {
      role: OpenAIRole.SYSTEM,
      content: `Please provide a recipe for ${input.recipeName}. ${this.responseFormat}`,
    };

    this.logger.log('Sending message to OpenAI', {
      message: initializeMessage,
    });

    const response = JSON.parse(
      await this.sendMessage([initializeMessage]),
    ) as unknown as OpenAIMeal;

    this.logger.log('Received response from OpenAI', {
      response,
    });

    return response;
  }

  public async suggestNextMeal(
    input: SuggestNextMealInput,
  ): Promise<OpenAIMeal> {
    const initializeMessage = {
      role: OpenAIRole.SYSTEM,
      content: `You will be provided a list of meals with their ingredients and instructions. Please choose a ${input.type} meal 
      to cook next. ${this.responseFormat}`,
    };

    const previousMealMessages = input.meals.map((meal) => ({
      role: OpenAIRole.SYSTEM,
      content: JSON.stringify(meal),
    }));

    const messages = [initializeMessage, ...previousMealMessages];

    this.logger.log('Sending message to OpenAI', {
      message: messages,
    });

    const response = (await this.sendMessage(
      messages,
    )) as unknown as OpenAIMeal;

    this.logger.log('Received response from OpenAI', {
      response,
    });

    return response;
  }

  private async sendMessage(messages: OpenAIMessage[]): Promise<string> {
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

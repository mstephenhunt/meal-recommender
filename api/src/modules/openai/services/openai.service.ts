import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { RequestCacheService } from '../../utils/services/request-cache.service';
import { lastValueFrom } from 'rxjs';
import {
  OpenAIMessage,
  OpenAIMeal,
  OpenAIRole,
  RequestRecipeNamesInput,
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

  public async requestRecipeNames(
    input: RequestRecipeNamesInput,
  ): Promise<string[]> {
    const initializeMessage = {
      role: OpenAIRole.SYSTEM,
      content: `Please provide a list of five recipe names that fit within the following dietary restrictions: ${input.dietaryRestrictions.join(
        ', ',
      )}. Have your message return in the JSON format: 
      {
        "recipeNames": ["recipe name 1", "recipe name 2", "recipe name 3", "recipe name 4", "recipe name 5"]
      }`,
    };

    this.logger.log('Sending message to OpenAI', {
      message: initializeMessage,
    });

    const response = JSON.parse(await this.sendMessage([initializeMessage]));

    this.logger.log('Received response from OpenAI', {
      response,
    });

    const recipeNames = response.recipeNames;

    this.logger.log('Converted response into recipe names', {
      recipeNames,
    });

    return recipeNames;
  }

  public async requestRecipe(input: {
    recipeName: string;
    dietaryRestrictions?: string[];
  }): Promise<OpenAIMeal> {
    const dietaryRestrictionsMessage = input.dietaryRestrictions
      ? `The recipe should fit the dietary restrictions: ${input.dietaryRestrictions.join(
          ', ',
        )}.`
      : undefined;

    const initializeMessage = {
      role: OpenAIRole.SYSTEM,
      content: `Please provide a recipe for ${input.recipeName}. ${dietaryRestrictionsMessage} ${this.responseFormat}`,
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

  public async requestRecipeWithFilters(input: {
    recipeName: string;
    ingredients?: string[];
    allergens?: string[];
    diets?: string[];
  }): Promise<OpenAIMeal> {
    const { recipeName, ingredients, allergens, diets } = input;

    const ingredientsMessage = ingredients
      ? `The recipe should use some or all of these ingredients: ${ingredients.join(
          ', ',
        )}.`
      : undefined;
    const allergensMessage = allergens
      ? `The recipe should not contain these allergens: ${allergens.join(
          ', ',
        )}.`
      : undefined;
    const dietsMessage = diets
      ? `The recipe should fit these diets: ${input.diets.join(', ')}.`
      : undefined;

    const initializeMessage = {
      role: OpenAIRole.SYSTEM,
      content: `Please provide a recipe for ${recipeName}. ${ingredientsMessage} ${allergensMessage} ${dietsMessage} ${this.responseFormat}`,
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
}

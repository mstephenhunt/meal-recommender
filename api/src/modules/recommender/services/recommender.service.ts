import { Injectable } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { Meal } from '../types';

@Injectable()
export class RecommenderService {
  constructor(private readonly openaiService: OpenaiService) {}

  public async requestRecipe(input: { recipeName: string }): Promise<Meal> {
    const response = await this.openaiService.requestRecipe(input);

    return response;
  }
}

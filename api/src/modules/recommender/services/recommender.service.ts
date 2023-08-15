import { Injectable } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenAIMeal } from '../types';
import { RecipeInput } from '../../recipe/types';
import { RecipeService } from '../../recipe/services/recipe.service';

@Injectable()
export class RecommenderService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly recipeService: RecipeService,
  ) {}

  public async requestRecipe(input: {
    recipeName: string;
  }): Promise<OpenAIMeal> {
    const recipe = await this.openaiService.requestRecipe(input);

    const recipeInput: RecipeInput = {
      name: recipe.name,
      instructions: recipe.instructions,
      recipeIngredients: recipe.ingredients.map((ingredient) => ({
        ingredient: {
          name: ingredient.name,
        },
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })),
    };

    await this.recipeService.saveRecipe(recipeInput);

    return recipe;
  }
}

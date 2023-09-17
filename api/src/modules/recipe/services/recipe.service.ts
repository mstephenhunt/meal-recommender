import { Injectable } from '@nestjs/common';
import { Ingredient, Recipe, RecipeInput, Allergen, Diet } from '../types';
import { Logger } from 'nestjs-pino';
import { OpenaiService } from '../../openai/services/openai.service';
import { SaveRecipeService } from './save-recipe.service';

@Injectable()
export class RecipeService {
  constructor(
    private readonly logger: Logger,
    private readonly openaiService: OpenaiService,
    private readonly saveRecipeService: SaveRecipeService,
  ) {}

  public async getFilteredRecipeNames(input: {
    ingredients?: Ingredient[];
    allergens?: Allergen[];
    diets?: Diet[];
  }): Promise<string[]> {
    const { ingredients, allergens, diets } = input;

    const recipeNames = await this.openaiService.requestFilteredRecipeNames({
      ingredients: ingredients.map((i) => i.name),
      allergens: allergens.map((a) => a.name),
      diets: diets.map((d) => d.name),
    });

    return recipeNames;
  }

  public async requestFilteredRecipe(input: {
    recipeName: string;
    ingredients?: Ingredient[];
    allergens?: Allergen[];
    diets?: Diet[];
  }): Promise<Recipe> {
    const { recipeName, ingredients, allergens, diets } = input;

    const recipe = await this.openaiService.requestRecipeWithFilters({
      recipeName,
      ingredients: ingredients.map((i) => i.name),
      allergens: allergens.map((a) => a.name),
      diets: diets.map((d) => d.name),
    });

    const recipeInput: RecipeInput = {
      name: recipe.name,
      instructions: recipe.instructions,
      recipeIngredients: recipe.ingredients.map((ingredient) => ({
        ingredient: {
          name: ingredient.name,
        },
        quantity: ingredient.quantity || 0,
        unit: ingredient.unit,
      })),
      filterAllergens: allergens,
      filterDiets: diets,
      filterIngredients: ingredients,
    };

    this.logger.log('Saving recipe', {
      recipeInput,
    });

    const savedRecipe = await this.saveRecipeService.saveRecipe(recipeInput);

    this.logger.log('Completed recipe lookup');
    return savedRecipe;
  }
}

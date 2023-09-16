import { Injectable } from '@nestjs/common';
import { RecipeService } from '../../recipe/services/recipe.service';
import { UserRecipeFiltersService } from './user-recipe-filters.service';
import { Recipe } from '../../recipe/types';

@Injectable()
export class GetFilteredRecipeService {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly userRecipeFiltersService: UserRecipeFiltersService,
  ) {}

  public async getFilteredRecipeNames(): Promise<string[]> {
    const filterIngredients =
      await this.userRecipeFiltersService.getUserIngredients();
    const filterAllergens =
      await this.userRecipeFiltersService.getUserAllergens();
    const filterDiets = await this.userRecipeFiltersService.getUserDiets();

    return this.recipeService.getFilteredRecipeNames({
      ingredients: filterIngredients,
      allergens: filterAllergens,
      diets: filterDiets,
    });
  }

  public async getFilteredRecipe(input: {
    recipeName: string;
  }): Promise<Recipe> {
    const { recipeName } = input;

    const filterIngredients =
      await this.userRecipeFiltersService.getUserIngredients();
    const filterAllergens =
      await this.userRecipeFiltersService.getUserAllergens();
    const filterDiets = await this.userRecipeFiltersService.getUserDiets();

    return this.recipeService.requestFilteredRecipe({
      recipeName,
      ingredients: filterIngredients,
      allergens: filterAllergens,
      diets: filterDiets,
    });
  }
}

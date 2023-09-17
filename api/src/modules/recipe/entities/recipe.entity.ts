import { Recipe } from '../types';
import { IngredientEntity } from './ingredient.entity';
import { AllergenFilterEntity } from './allergen-filter.entity';
import { IngredientFilterEntity } from './ingredient-filter.entity';
import { DietFilterEntity } from './diet-filter.entity';

export class RecipeEntity {
  public readonly id: number;
  public readonly name: string;
  public readonly instructions: string;
  public readonly ingredients: IngredientEntity[];
  public readonly allergenFilters?: AllergenFilterEntity[];
  public readonly ingredientFilters?: IngredientFilterEntity[];
  public readonly dietFilters?: DietFilterEntity[];

  constructor(recipe: Recipe) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.instructions = recipe.instructions;
    this.ingredients = recipe.recipeIngredients.map(
      (recipeIngredient) =>
        new IngredientEntity(
          {
            id: recipeIngredient.ingredient.id,
            name: recipeIngredient.ingredient.name,
            displayName: recipeIngredient.ingredient.displayName,
          },
          recipeIngredient.quantity,
          recipeIngredient.unit,
        ),
    );

    if (recipe.filterAllergens) {
      this.allergenFilters = recipe.filterAllergens.map(
        (allergenFilter) =>
          new AllergenFilterEntity({
            id: allergenFilter.id,
            name: allergenFilter.name,
            displayName: allergenFilter.displayName,
          }),
      );
    }

    if (recipe.filterIngredients) {
      this.ingredientFilters = recipe.filterIngredients.map(
        (ingredientFilter) =>
          new IngredientFilterEntity({
            id: ingredientFilter.id,
            name: ingredientFilter.name,
            displayName: ingredientFilter.displayName,
          }),
      );
    }

    if (recipe.filterDiets) {
      this.dietFilters = recipe.filterDiets.map(
        (dietFilter) =>
          new DietFilterEntity({
            id: dietFilter.id,
            name: dietFilter.name,
            displayName: dietFilter.displayName,
          }),
      );
    }
  }
}

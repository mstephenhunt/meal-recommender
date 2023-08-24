import { Recipe } from '../types';
import { IngredientEntity } from './ingredient.entity';

export class RecipeEntity {
  public readonly id: number;
  public readonly name: string;
  public readonly instructions: string;
  public readonly ingredients: IngredientEntity[];

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
          },
          recipeIngredient.quantity,
          recipeIngredient.unit,
        ),
    );
  }
}

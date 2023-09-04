import { Recipe } from '../types';
import { IngredientEntity } from './ingredient.entity';
import { DietaryRestrictionEntity } from '../..//dietary-restriction/entities/dietary-restriction.entity';

export class RecipeEntity {
  public readonly id: number;
  public readonly name: string;
  public readonly instructions: string;
  public readonly ingredients: IngredientEntity[];
  public readonly dietaryRestrictions: DietaryRestrictionEntity[];

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
    this.dietaryRestrictions = recipe.dietaryRestrictions.map(
      (dietaryRestriction) =>
        new DietaryRestrictionEntity({
          id: dietaryRestriction.id,
          name: dietaryRestriction.name,
        }),
    );
  }
}

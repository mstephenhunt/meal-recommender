import { DietaryRestriction } from '../dietary-restriction/services/dietary-restriction.service';

export type Ingredient = {
  id: number;
  name: string;
};

export type IngredientInput = {
  name: string;
};

export type RecipeIngredient = {
  id: number;
  ingredient: Ingredient;
  quantity: number;
  unit: string;
};

export type RecipeIngredientInput = {
  ingredient: IngredientInput;
  quantity: number;
  unit: string;
};

export type Recipe = {
  id: number;
  name: string;
  instructions: string;
  recipeIngredients: RecipeIngredient[];
  dietaryRestrictions?: DietaryRestriction[];
};

export type RecipeInput = {
  name: string;
  instructions: string;
  recipeIngredients: RecipeIngredientInput[];
};

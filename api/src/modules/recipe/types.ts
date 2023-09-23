export type Allergen = {
  id: number;
  name: string;
  displayName: string;
};

export type AllergenInput = {
  name: string;
};

export type Diet = {
  id: number;
  name: string;
  displayName: string;
};

export type DietInput = {
  name: string;
};

export type Ingredient = {
  id: number;
  name: string;
  displayName: string;
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
  createdAt: Date;
  updatedAt: Date;
  name: string;
  instructions: string;
  recipeIngredients: RecipeIngredient[];
  filterIngredients?: Ingredient[];
  filterAllergens?: Allergen[];
  filterDiets?: Diet[];
};

export type RecipeInput = {
  name: string;
  instructions: string;
  recipeIngredients: RecipeIngredientInput[];
  filterIngredients?: Ingredient[];
  filterAllergens?: Allergen[];
  filterDiets?: Diet[];
};

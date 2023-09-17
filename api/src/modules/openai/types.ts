export enum OpenAIRole {
  USER = 'user',
  SYSTEM = 'system',
}

export type OpenAIMessage = {
  role: OpenAIRole;
  content: string;
};

export type OpenAIMeal = {
  name: string;
  ingredients: OpenAIIngredient[];
  instructions: string;
};

export type OpenAIIngredient = {
  name: string;
  quantity: number;
  unit: string;
};

export type RequestFilteredRecipeNamesInput = {
  ingredients?: string[];
  allergens?: string[];
  diets?: string[];
};

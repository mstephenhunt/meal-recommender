export enum OpenAIRole {
  USER = 'user',
  SYSTEM = 'system',
}

export type OpenAIMessage = {
  role: OpenAIRole;
  content: string;
};

export enum SuggestNextMealType {
  SIMILAR = 'similar',
  DIFFERENT = 'different',
}

export type SuggestNextMealInput = {
  type: SuggestNextMealType;
  meals: OpenAIMeal[];
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

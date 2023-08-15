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
  meals: Meal[];
};

export type Meal = {
  name: string;
  ingredients: string[];
  instructions: string;
};

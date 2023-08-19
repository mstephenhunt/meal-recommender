import { OpenAIMeal } from '../types';

export class Recipe {
  public name: string;
  public ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  public instructions: string;

  constructor(openAiMeal: OpenAIMeal) {
    this.name = openAiMeal.name;
    this.ingredients = openAiMeal.ingredients.map((ingredient) => ({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    }));
    this.instructions = openAiMeal.instructions;
  }
}

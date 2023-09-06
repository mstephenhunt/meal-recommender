import { Ingredient } from '../types';

export class IngredientFilterEntity {
  public readonly id: number;
  public readonly name: string;
  public readonly displayName: string;

  constructor(ingredient: Ingredient) {
    this.id = ingredient.id;
    this.name = ingredient.name;
    this.displayName = ingredient.displayName;
  }
}

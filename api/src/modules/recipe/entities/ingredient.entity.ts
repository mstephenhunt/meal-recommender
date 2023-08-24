import { Ingredient } from '../types';

export class IngredientEntity {
  public readonly id: number;
  public readonly name: string;
  public readonly quantity: number;
  public readonly unit: string;

  constructor(ingredient: Ingredient, quantity: number, unit: string) {
    this.id = ingredient.id;
    this.name = ingredient.name;
    this.quantity = quantity;
    this.unit = unit;
  }
}

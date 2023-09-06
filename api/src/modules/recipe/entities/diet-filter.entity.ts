import { Diet } from '../types';

export class DietFilterEntity {
  public readonly id: number;
  public readonly name: string;
  public readonly displayName: string;

  constructor(diet: Diet) {
    this.id = diet.id;
    this.name = diet.name;
    this.displayName = diet.displayName;
  }
}

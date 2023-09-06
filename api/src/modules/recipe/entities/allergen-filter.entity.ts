import { Allergen } from '../types';

export class AllergenFilterEntity {
  public readonly id: number;
  public readonly name: string;
  public readonly displayName: string;

  constructor(allergen: Allergen) {
    this.id = allergen.id;
    this.name = allergen.name;
    this.displayName = allergen.displayName;
  }
}

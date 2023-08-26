import { DietaryRestriction } from '../services/dietary-restriction.service';

export class DietaryRestrictionEntity {
  public readonly id: number;
  public readonly name: string;

  constructor(dietaryRestriction: DietaryRestriction) {
    this.id = dietaryRestriction.id;
    this.name = dietaryRestriction.name;
  }
}

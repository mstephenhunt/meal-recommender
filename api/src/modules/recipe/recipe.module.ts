import { Module } from '@nestjs/common';
import { RecipeService } from './services/recipe.service';
import { IngredientService } from './services/ingredient.service';
import { DbModule } from '../db/db.module';
import { DietaryRestrictionService } from './services/dietary-restriction.service';

@Module({
  imports: [DbModule],
  providers: [RecipeService, IngredientService, DietaryRestrictionService],
  exports: [RecipeService, DietaryRestrictionService],
})
export class RecipeModule {}

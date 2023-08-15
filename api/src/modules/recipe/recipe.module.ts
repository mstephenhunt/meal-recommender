import { Module } from '@nestjs/common';
import { RecipeService } from './services/recipe.service';
import { IngredientService } from './services/ingredient.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [RecipeService, IngredientService],
  exports: [RecipeService],
})
export class RecipeModule {}

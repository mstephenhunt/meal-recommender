import { Module } from '@nestjs/common';
import { RecipeService } from './service/recipe.service';
import { IngredientService } from './service/ingredient.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [RecipeService, IngredientService],
})
export class RecipeModule {}

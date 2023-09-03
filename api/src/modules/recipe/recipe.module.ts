import { Module } from '@nestjs/common';
import { RecipeService } from './services/recipe.service';
import { IngredientService } from './services/ingredient.service';
import { DbModule } from '../db/db.module';
import { DietaryRestrictionModule } from '../dietary-restriction/dietary-restriction.module';
import { OpenaiModule } from '../openai/openai.module';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from '../auth/auth.module';
import { UserRecipeService } from './services/user-recipe.service';

@Module({
  imports: [
    DbModule,
    OpenaiModule,
    LoggerModule,
    DietaryRestrictionModule,
    AuthModule,
  ],
  providers: [RecipeService, IngredientService, UserRecipeService],
  exports: [RecipeService],
})
export class RecipeModule {}

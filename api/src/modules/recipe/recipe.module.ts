import { Module } from '@nestjs/common';
import { RecipeService } from './services/recipe.service';
import { DbModule } from '../db/db.module';
import { DietaryRestrictionModule } from '../dietary-restriction/dietary-restriction.module';
import { OpenaiModule } from '../openai/openai.module';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from '../auth/auth.module';
import { UserRecipeService } from './services/user-recipe.service';
import { RecipeFilterService } from './services/recipe-filter.service';

@Module({
  imports: [
    DbModule,
    OpenaiModule,
    LoggerModule,
    DietaryRestrictionModule,
    AuthModule,
  ],
  providers: [RecipeService, UserRecipeService, RecipeFilterService],
  exports: [RecipeService],
})
export class RecipeModule {}

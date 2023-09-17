import { Module } from '@nestjs/common';
import { RecipeService } from './services/recipe.service';
import { DbModule } from '../db/db.module';
import { OpenaiModule } from '../openai/openai.module';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from '../auth/auth.module';
import { RecipeFilterService } from './services/recipe-filter.service';
import { SaveRecipeService } from './services/save-recipe.service';

@Module({
  imports: [DbModule, OpenaiModule, LoggerModule, AuthModule],
  providers: [RecipeService, RecipeFilterService, SaveRecipeService],
  exports: [RecipeService, RecipeFilterService],
})
export class RecipeModule {}

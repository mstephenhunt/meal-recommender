import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db/db.module';
import { UserController } from './controllers/user.controller';
import { UserContextService } from './services/user-context.service';
import { UserPreferencesController } from './controllers/user-preferences.controller';
import { ConfigModule } from '@nestjs/config';
import { UserPreferencesService } from './services/user-preferences.service';
import { LoggerModule } from 'nestjs-pino';
import { DietaryRestrictionModule } from '../dietary-restriction/dietary-restriction.module';
import { RecipeModule } from '../recipe/recipe.module';
import { UserRecipesController } from './controllers/user-recipe.controller';
import { UserRecipeService } from './services/user-recipe.service';
import { UserRecipeFiltersController } from './controllers/user-recipe-filter.controller';
import { UserRecipeFiltersService } from './services/user-recipe-filters.service';
import { FilteredRecipeController } from './controllers/filtered-recipe.controller';
import { GetFilteredRecipeService } from './services/get-filtered-recipe.service';

@Module({
  imports: [
    AuthModule,
    DbModule,
    ConfigModule.forRoot(),
    LoggerModule,
    DietaryRestrictionModule,
    RecipeModule,
  ],
  controllers: [
    UserController,
    UserPreferencesController,
    UserRecipesController,
    UserRecipeFiltersController,
    FilteredRecipeController,
  ],
  providers: [
    UserService,
    UserContextService,
    UserPreferencesService,
    UserContextService,
    UserRecipeService,
    UserRecipeFiltersService,
    GetFilteredRecipeService,
  ],
})
export class UserModule {}

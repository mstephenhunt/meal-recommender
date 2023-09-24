import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db/db.module';
import { UserController } from './controllers/user.controller';
import { UserContextService } from './services/user-context.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { RecipeModule } from '../recipe/recipe.module';
import { UserRecipeFiltersController } from './controllers/user-recipe-filter.controller';
import { UserRecipeFiltersService } from './services/user-recipe-filters.service';
import { FilteredRecipeController } from './controllers/filtered-recipe.controller';
import { GetFilteredRecipeService } from './services/get-filtered-recipe.service';
import { UserRecipesController } from './controllers/user-recipes.controller';
import { GetMyRecipesService } from './services/get-my-recipes.service';
import { FavoritesController } from './controllers/favorites.controller';
import { FavoritesService } from './services/favorites.service';

@Module({
  imports: [
    AuthModule,
    DbModule,
    ConfigModule.forRoot(),
    LoggerModule,
    RecipeModule,
  ],
  controllers: [
    UserController,
    UserRecipeFiltersController,
    FilteredRecipeController,
    UserRecipesController,
    FavoritesController,
  ],
  providers: [
    UserService,
    UserContextService,
    UserContextService,
    UserRecipeFiltersService,
    GetFilteredRecipeService,
    GetMyRecipesService,
    FavoritesService,
  ],
})
export class UserModule {}

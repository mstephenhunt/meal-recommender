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
  ],
  providers: [
    UserService,
    UserContextService,
    UserContextService,
    UserRecipeFiltersService,
    GetFilteredRecipeService,
  ],
})
export class UserModule {}

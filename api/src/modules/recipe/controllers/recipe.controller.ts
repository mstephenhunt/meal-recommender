import { Injectable, Controller, UseGuards, Get, Query } from '@nestjs/common';
import { UserGuard } from '../../auth/guards/user.guard';
import { Logger } from 'nestjs-pino';
import { RecipeService } from '../services/recipe.service';
import { RecipeEntity } from '../entities/recipe.entity';

@Injectable()
@Controller('api/recipe')
@UseGuards(UserGuard)
export class RecipeController {
  constructor(
    private readonly logger: Logger,
    private readonly recipeService: RecipeService,
  ) {}

  @Get('/request-recipe-names')
  public async getRecipeNames(): Promise<{ recipeNames: string[] }> {
    this.logger.log('Requesting recipe names');

    return {
      recipeNames: await this.recipeService.requestRecipeNames(),
    };
  }

  @Get('/generate-recipe')
  public async generateRecipe(
    @Query('recipeName') recipeName: string,
  ): Promise<RecipeEntity> {
    this.logger.log('Generating recipe', {
      recipeName,
    });

    const recipe = await this.recipeService.requestRecipe({
      recipeName,
    });

    return new RecipeEntity(recipe);
  }

  @Get('/user-created-recipes')
  public async getUserCreatedRecipeNames(): Promise<{
    recipes: RecipeEntity[];
  }> {
    const recipes = await this.recipeService.getUserSavedRecipes();

    return {
      recipes: recipes.map((recipe) => new RecipeEntity(recipe)),
    };
  }
}

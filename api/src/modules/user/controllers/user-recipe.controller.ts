import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { UserRecipeService } from '../services/user-recipe.service';
import { RecipeEntity } from '../../recipe/entities/recipe.entity';
import { UserGuard } from '../../auth/guards/user.guard';

@Controller('api/me/recipes')
@UseGuards(UserGuard)
export class UserRecipesController {
  constructor(
    private readonly logger: Logger,
    private readonly userRecipeService: UserRecipeService,
  ) {}

  @Get('/filtered-recipe-names')
  public async getFilteredRecipeNames(): Promise<{ recipeNames: string[] }> {
    this.logger.log('Requesting recipe names');

    return {
      recipeNames: await this.userRecipeService.getFilteredRecipeNames(),
    };
  }

  // DEPRECATED
  @Get('/request-recipe-names')
  public async getRecipeNames(): Promise<{ recipeNames: string[] }> {
    this.logger.log('Requesting recipe names');

    return {
      recipeNames: await this.userRecipeService.getRecipeNames(),
    };
  }

  // DEPRECATED
  @Get('/generate-recipe')
  public async generateRecipe(
    @Query('recipeName') recipeName: string,
  ): Promise<RecipeEntity> {
    this.logger.log('Generating recipe', {
      recipeName,
    });

    const recipe = await this.userRecipeService.generateRecipe({
      recipeName,
    });

    return new RecipeEntity(recipe);
  }
}

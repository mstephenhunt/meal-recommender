import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserGuard } from '../../auth/guards/user.guard';
import { GetFilteredRecipeService } from '../services/get-filtered-recipe.service';
import { RecipeEntity } from '../../recipe/entities/recipe.entity';

@Controller('api/me/filtered-recipe')
@UseGuards(UserGuard)
export class FilteredRecipeController {
  constructor(
    private readonly getFilteredRecipeService: GetFilteredRecipeService,
  ) {}

  @Get('/names')
  public async getFilteredRecipeNames(): Promise<{ recipeNames: string[] }> {
    return {
      recipeNames: await this.getFilteredRecipeService.getFilteredRecipeNames(),
    };
  }

  @Get()
  public async getFilteredRecipe(
    @Query('recipeName') recipeName: string,
  ): Promise<RecipeEntity> {
    const recipe = await this.getFilteredRecipeService.getFilteredRecipe({
      recipeName,
    });

    console.log(`\n\n --------> ${JSON.stringify(recipe, null, 2)} \n\n`);

    return new RecipeEntity(recipe);
  }
}

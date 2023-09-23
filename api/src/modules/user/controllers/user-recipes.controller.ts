import { Controller, Get, UseGuards } from '@nestjs/common';
import { RecipeEntity } from '../../recipe/entities/recipe.entity';
import { UserGuard } from '../../auth/guards/user.guard';
import { GetMyRecipesService } from '../services/get-my-recipes.service';

@Controller('api/me/recipes')
@UseGuards(UserGuard)
export class UserRecipesController {
  constructor(private readonly getMyRecipesService: GetMyRecipesService) {}

  @Get()
  public async getMyRecipes(): Promise<RecipeEntity[]> {
    const recipes = await this.getMyRecipesService.getMyRecipes();

    return recipes.map((recipe) => new RecipeEntity(recipe));
  }
}

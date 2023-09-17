import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { GetRecipeService } from '../services/get-recipe.service';
import { UserGuard } from '../../auth/guards/user.guard';
import { RecipeEntity } from '../entities/recipe.entity';

@Controller('recipes')
@UseGuards(UserGuard)
export class RecipeController {
  constructor(private readonly getRecipeService: GetRecipeService) {}

  @Get('/:id')
  public async getRecipeById(@Param('id') id: string): Promise<RecipeEntity> {
    const recipe = await this.getRecipeService.getRecipeById(parseInt(id));

    return new RecipeEntity(recipe);
  }
}

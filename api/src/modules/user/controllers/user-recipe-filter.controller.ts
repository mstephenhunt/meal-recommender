import { Controller, Get, Post, Delete, UseGuards, Body } from '@nestjs/common';
import { UserGuard } from '../../auth/guards/user.guard';
import { UserRecipeFiltersService } from '../services/user-recipe-filters.service';
import { IngredientFilterEntity } from '../../recipe/entities/ingredient-filter.entity';

@Controller('/api/user/recipe-filters')
@UseGuards(UserGuard)
export class UserRecipeFiltersController {
  constructor(
    private readonly userRecipeFiltersService: UserRecipeFiltersService,
  ) {}

  @Get('ingredients')
  public async getUserIngredients(): Promise<IngredientFilterEntity[]> {
    const userFilterIngredients =
      await this.userRecipeFiltersService.getUserIngredients();

    return userFilterIngredients.map(
      (ingredient) => new IngredientFilterEntity(ingredient),
    );
  }

  @Post('ingredients')
  public async addUserIngredient(
    @Body() input: { ingredientName: string },
  ): Promise<IngredientFilterEntity> {
    const { ingredientName } = input;

    const userIngredient =
      await this.userRecipeFiltersService.upsertUserIngredient({
        ingredientName,
      });

    return new IngredientFilterEntity(userIngredient);
  }

  @Delete('ingredients')
  public async deleteUserIngredient(
    @Body() input: { ingredientId: number },
  ): Promise<void> {
    const { ingredientId } = input;

    await this.userRecipeFiltersService.deleteUserIngredient({
      ingredientId,
    });
  }
}

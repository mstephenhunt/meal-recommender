import { Controller, Get, Post, Delete, UseGuards, Body } from '@nestjs/common';
import { UserGuard } from '../../auth/guards/user.guard';
import { UserRecipeFiltersService } from '../services/user-recipe-filters.service';
import { IngredientFilterEntity } from '../../recipe/entities/ingredient-filter.entity';
import { DietFilterEntity } from '../../recipe/entities/diet-filter.entity';
import { AllergenFilterEntity } from '../../recipe/entities/allergen-filter.entity';

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

  @Get('diets')
  public async getUserDiets(): Promise<DietFilterEntity[]> {
    const userFilterDiets = await this.userRecipeFiltersService.getUserDiets();

    return userFilterDiets.map((diet) => new DietFilterEntity(diet));
  }

  @Post('diets')
  public async addUserDiet(
    @Body() input: { dietName: string },
  ): Promise<DietFilterEntity> {
    const { dietName } = input;

    const dietFilter = await this.userRecipeFiltersService.upsertUserDiet({
      dietName,
    });

    return new DietFilterEntity(dietFilter);
  }

  @Delete('diets')
  public async deleteUserDiet(
    @Body() input: { dietId: number },
  ): Promise<void> {
    const { dietId } = input;

    await this.userRecipeFiltersService.deleteUserDiet({
      dietId,
    });
  }

  @Get('allergens')
  public async getUserAllergens(): Promise<AllergenFilterEntity[]> {
    const userFilterAllergens =
      await this.userRecipeFiltersService.getUserAllergens();

    return userFilterAllergens.map(
      (allergen) => new AllergenFilterEntity(allergen),
    );
  }

  @Post('allergens')
  public async addUserAllergen(
    @Body() input: { allergenName: string },
  ): Promise<AllergenFilterEntity> {
    const { allergenName } = input;

    const allergenFilter =
      await this.userRecipeFiltersService.upsertUserAllergen({
        allergenName,
      });

    return new AllergenFilterEntity(allergenFilter);
  }

  @Delete('allergens')
  public async deleteUserAllergen(
    @Body() input: { allergenId: number },
  ): Promise<void> {
    const { allergenId } = input;

    await this.userRecipeFiltersService.deleteUserAllergen({
      allergenId,
    });
  }
}

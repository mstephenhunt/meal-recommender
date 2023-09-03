import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { UserContextService } from './user-context.service';
import { RecipeService } from '../../recipe/services/recipe.service';
import { DietaryRestrictionService } from '../../dietary-restriction/services/dietary-restriction.service';
import { Recipe } from '../../recipe/types';
import { PrismaService } from '../..//db/services/prisma.service';

@Injectable()
export class UserRecipeService {
  constructor(
    private readonly logger: Logger,
    private readonly userContextService: UserContextService,
    private readonly recipeService: RecipeService,
    private readonly dietaryRestrictionService: DietaryRestrictionService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * Gets recipe names based on the current user's dietary restrictions.
   */
  public async getRecipeNames(): Promise<string[]> {
    this.logger.log('Requesting recipe names');

    const userId = await this.userContextService.userId;
    const dietaryRestrictions =
      await this.dietaryRestrictionService.getUserDietaryRestrictions(userId);

    return this.recipeService.requestRecipeNames({
      dietaryRestrictions,
    });
  }

  public async generateRecipe(input: { recipeName: string }): Promise<Recipe> {
    const userId = await this.userContextService.userId;
    const dietaryRestrictions =
      await this.dietaryRestrictionService.getUserDietaryRestrictions(userId);

    const recipe = await this.recipeService.requestRecipe({
      userId,
      recipeName: input.recipeName,
      dietaryRestrictions,
    });

    this.logger.log('Associating recipe to user', {
      userId,
      recipeId: recipe.id,
    });

    await this.prismaService.userRecipe.create({
      data: {
        userId,
        recipeId: recipe.id,
      },
    });

    return recipe;
  }
}

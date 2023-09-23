import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/services/prisma.service';
import { Recipe } from '../../recipe/types';
import { UserContextService } from './user-context.service';
import { GetRecipeService } from '../../recipe/services/get-recipe.service';

@Injectable()
export class GetMyRecipesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userContextService: UserContextService,
    private readonly getRecipeService: GetRecipeService,
  ) {}

  public async getMyRecipes(): Promise<Recipe[]> {
    const userId = this.userContextService.userId;

    // First get all of the user recipe ids associated with the user id
    const userRecipeIds = await this.prismaService.userRecipe.findMany({
      where: { userId },
      select: { recipeId: true },
    });

    // For each of these recipe ids, get the recipe
    return Promise.all(
      userRecipeIds.map(async ({ recipeId }) => {
        const recipe = await this.getRecipeService.getRecipeById(recipeId);

        return recipe;
      }),
    );
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/services/prisma.service';
import { UserContextService } from './user-context.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userContextService: UserContextService,
  ) {}

  public async getMyFavoriteRecipeIds(): Promise<number[]> {
    const userId = this.userContextService.userId;

    const userRecipes = await this.prismaService.userRecipe.findMany({
      where: {
        userId,
      },
    });

    return userRecipes.map((userRecipe) => userRecipe.recipeId);
  }

  public async addMyFavoriteRecipe(input: { recipeId: number }): Promise<void> {
    const { recipeId } = input;
    const userId = this.userContextService.userId;

    await this.prismaService.userRecipe.create({
      data: {
        userId,
        recipeId,
      },
    });
  }

  public async removeMyFavoriteRecipe(input: {
    recipeId: number;
  }): Promise<void> {
    const { recipeId } = input;
    const userId = this.userContextService.userId;

    await this.prismaService.userRecipe.delete({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });
  }
}

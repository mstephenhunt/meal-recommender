import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { RecipeFilterService } from '../../recipe/services/recipe-filter.service';
import { Ingredient } from '../../recipe/types';
import { PrismaService } from '../../db/services/prisma.service';
import { UserContextService } from './user-context.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRecipeFiltersService {
  constructor(
    private readonly logger: Logger,
    private readonly recipeFilterService: RecipeFilterService,
    private readonly prismaService: PrismaService,
    private readonly userContextService: UserContextService,
  ) {}

  public async getUserIngredients(): Promise<Ingredient[]> {
    const userId = this.userContextService.userId;

    this.logger.log('Getting user ingredients', {
      userId,
    });

    const ingredients = await this.prismaService.$queryRaw<Ingredient[]>(
      Prisma.sql`
        SELECT
          i.id,
          i.name,
          i.display_name as "displayName"
        FROM
          user_ingredients ui
          JOIN ingredients i ON ui.ingredient_id = i.id
        WHERE
          ui.user_id = ${userId};
      `,
    );

    return ingredients;
  }

  public async deleteUserIngredient(input: {
    ingredientId: number;
  }): Promise<void> {
    const { ingredientId } = input;
    const userId = this.userContextService.userId;

    this.logger.log('Deleting user ingredient', {
      ingredientId,
      userId,
    });

    await this.prismaService.$queryRaw<Ingredient[]>(
      Prisma.sql`
        DELETE FROM
          user_ingredients
        WHERE
          user_id = ${userId}
          AND ingredient_id = ${ingredientId};
      `,
    );
  }

  public async upsertUserIngredient(input: {
    ingredientName: string;
  }): Promise<Ingredient> {
    const { ingredientName } = input;
    const userId = this.userContextService.userId;

    this.logger.log('Upserting user ingredient', {
      ingredientName,
      userId,
    });

    // Start a transaction
    let ingredient;
    await this.prismaService.$transaction(async (prisma) => {
      ingredient = await this.recipeFilterService.upsertIngredient({
        ingredientInput: {
          name: ingredientName,
        },
        prismaTransaction: prisma,
      });

      await prisma.usersIngredients.upsert({
        where: {
          userId_ingredientId: {
            userId,
            ingredientId: ingredient.id,
          },
        },
        update: {}, // No-op, thing already exists
        create: {
          userId,
          ingredientId: ingredient.id,
        },
      });
    });

    this.logger.log('Added ingredient to user', {
      ingredient,
      userId: this.userContextService.userId,
    });

    return ingredient;
  }
}

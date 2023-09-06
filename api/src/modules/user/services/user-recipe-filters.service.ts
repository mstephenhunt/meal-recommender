import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { RecipeFilterService } from '../../recipe/services/recipe-filter.service';
import { Ingredient, Diet, Allergen } from '../../recipe/types';
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

  public async getUserDiets(): Promise<Diet[]> {
    const userId = this.userContextService.userId;

    this.logger.log('Getting user diets', {
      userId,
    });

    const diets = await this.prismaService.$queryRaw<Diet[]>(
      Prisma.sql`
        SELECT
          d.id,
          d.name,
          d.display_name as "displayName"
        FROM
          user_diets ud
          JOIN diets d ON ud.diet_id = d.id
        WHERE
          ud.user_id = ${userId};
      `,
    );

    return diets;
  }

  public async deleteUserDiet(input: { dietId: number }): Promise<void> {
    const { dietId } = input;
    const userId = this.userContextService.userId;

    this.logger.log('Deleting user diet', {
      dietId,
      userId,
    });

    await this.prismaService.$queryRaw<Diet[]>(
      Prisma.sql`
        DELETE FROM
          user_diets
        WHERE
          user_id = ${userId}
          AND diet_id = ${dietId};
      `,
    );
  }

  public async upsertUserDiet(input: { dietName: string }): Promise<Diet> {
    const { dietName } = input;
    const userId = this.userContextService.userId;

    this.logger.log('Upserting user diet', {
      dietName,
      userId,
    });

    // Start a transaction
    let diet;
    await this.prismaService.$transaction(async (prisma) => {
      diet = await this.recipeFilterService.upsertDiet({
        dietInput: {
          name: dietName,
        },
        prismaTransaction: prisma,
      });

      await prisma.usersDiets.upsert({
        where: {
          userId_dietId: {
            userId,
            dietId: diet.id,
          },
        },
        update: {}, // No-op, thing already exists
        create: {
          userId,
          dietId: diet.id,
        },
      });
    });

    this.logger.log('Added diet to user', {
      diet,
      userId: this.userContextService.userId,
    });

    return diet;
  }

  public async getUserAllergens(): Promise<Allergen[]> {
    const userId = this.userContextService.userId;

    this.logger.log('Getting user allergens', {
      userId,
    });

    const allergens = await this.prismaService.$queryRaw<Allergen[]>(
      Prisma.sql`
        SELECT
          a.id,
          a.name,
          a.display_name as "displayName"
        FROM
          user_allergens ua
          JOIN allergens a ON ua.allergen_id = a.id
        WHERE
          ua.user_id = ${userId};
      `,
    );

    return allergens;
  }

  public async deleteUserAllergen(input: {
    allergenId: number;
  }): Promise<void> {
    const { allergenId } = input;
    const userId = this.userContextService.userId;

    this.logger.log('Deleting user allergen', {
      allergenId,
      userId,
    });

    await this.prismaService.$queryRaw<Allergen[]>(
      Prisma.sql`
        DELETE FROM
          user_allergens
        WHERE
          user_id = ${userId}
          AND allergen_id = ${allergenId};
      `,
    );
  }

  public async upsertUserAllergen(input: {
    allergenName: string;
  }): Promise<Allergen> {
    const { allergenName } = input;
    const userId = this.userContextService.userId;

    this.logger.log('Upserting user allergen', {
      allergenName,
      userId,
    });

    // Start a transaction
    let allergen;
    await this.prismaService.$transaction(async (prisma) => {
      allergen = await this.recipeFilterService.upsertAllergen({
        allergenInput: {
          name: allergenName,
        },
        prismaTransaction: prisma,
      });

      await prisma.usersAllergens.upsert({
        where: {
          userId_allergenId: {
            userId,
            allergenId: allergen.id,
          },
        },
        update: {}, // No-op, thing already exists
        create: {
          userId,
          allergenId: allergen.id,
        },
      });
    });

    this.logger.log('Added allergen to user', {
      allergen,
      userId: this.userContextService.userId,
    });

    return allergen;
  }
}

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Recipe } from '../types';
import { PrismaService } from '../../db/services/prisma.service';
import { UserContextService } from '../../user/services/user-context.service';

@Injectable()
export class UserRecipeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userContextService: UserContextService,
  ) {}

  /**
   * For the current user, get all their created recipes
   */
  public async getUserSavedRecipes(): Promise<Recipe[]> {
    const userId = await this.userContextService.userId;

    const userRecipes = await this.prisma.$queryRaw<
      {
        recipe_id: number;
        name: string;
        instructions: string;
      }[]
    >(
      Prisma.sql`
        SELECT 
          r.id AS recipe_id,
          r.name,
          r.instructions
        FROM user_recipes ur
        JOIN recipes r ON ur."recipeId" = r.id
        WHERE ur."userId" = ${userId};
      `,
    );

    const recipes = await Promise.all(
      userRecipes.map(async (userRecipe) => {
        const ingredients = await this.prisma.$queryRaw<
          {
            ingredientId: number;
            name: string;
            recipeIngredientId: number;
            quantity: number;
            unit: string;
          }[]
        >(Prisma.sql`
          SELECT
            i.id as "ingredientId",
            i.name,
            ri.id as "recipeIngredientId",
            ri.quantity,
            ri.unit
          FROM
            public.recipe_ingredients ri
            JOIN public.ingredients i on i.id = ri."ingredientId"
          WHERE
            ri."recipeId" = ${userRecipe.recipe_id};
        `);

        return {
          id: userRecipe.recipe_id,
          name: userRecipe.name,
          instructions: userRecipe.instructions,
          recipeIngredients: ingredients.map((ingredient) => ({
            id: ingredient.recipeIngredientId,
            ingredient: {
              id: ingredient.ingredientId,
              name: ingredient.name,
            },
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          })),
        };
      }),
    );

    return recipes;
  }

  /**
   * For the current user, returns a recipe if one exists for the provided name
   */
  public async getUserCachedRecipeByName(name: string): Promise<Recipe | null> {
    const userId = await this.userContextService.userId;

    const userRecipe = await this.prisma.$queryRaw<
      {
        recipe_id: number;
        name: string;
        instructions: string;
      }[]
    >(
      Prisma.sql`
        SELECT 
          r.id AS recipe_id,
          r.name,
          r.instructions
        FROM user_recipes ur
        JOIN recipes r ON ur."recipeId" = r.id
        WHERE ur."userId" = ${userId}
          AND r.name = ${name};
      `,
    );

    if (userRecipe.length !== 1) {
      return null;
    }

    const recipe = {
      id: userRecipe[0].recipe_id,
      name: userRecipe[0].name,
      instructions: userRecipe[0].instructions,
    };

    const ingredients = await this.prisma.$queryRaw<
      {
        ingredientId: number;
        name: string;
        recipeIngredientId: number;
        quantity: number;
        unit: string;
      }[]
    >(Prisma.sql`
      SELECT
        i.id as "ingredientId",
        i.name,
        ri.id as "recipeIngredientId",
        ri.quantity,
        ri.unit
      FROM
        public.recipe_ingredients ri
        JOIN public.ingredients i on i.id = ri."ingredientId"
      WHERE
        ri."recipeId" = ${recipe.id};
    `);

    return {
      id: recipe.id,
      name: recipe.name,
      instructions: recipe.instructions,
      recipeIngredients: ingredients.map((ingredient) => ({
        id: ingredient.recipeIngredientId,
        ingredient: {
          id: ingredient.ingredientId,
          name: ingredient.name,
        },
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })),
    };
  }
}

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Recipe } from '../types';
import { PrismaService } from '../../db/services/prisma.service';

@Injectable()
export class UserRecipeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * For the current user, returns a recipe if one exists for the provided name
   */
  public async getUserCachedRecipeByName(input: {
    userId: number;
    name: string;
  }): Promise<Recipe | null> {
    const { userId, name } = input;

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
        JOIN recipes r ON ur.recipe_id = r.id
        WHERE ur.user_id = ${userId}
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
        displayName: string;
        recipeIngredientId: number;
        quantity: number;
        unit: string;
      }[]
    >(Prisma.sql`
      SELECT
        i.id as "ingredientId",
        i.name,
        i.display_name as "displayName",
        ri.id as "recipeIngredientId",
        ri.quantity,
        ri.unit
      FROM
        public.recipe_ingredients ri
        JOIN public.ingredients i on i.id = ri."ingredientId"
      WHERE
        ri."recipeId" = ${recipe.id};
    `);

    const dietaryRestrictions = await this.prisma.$queryRaw<
      {
        id: number;
        name: string;
      }[]
    >(Prisma.sql`
      SELECT
        dr.id,
        dr.name
      FROM
        public.recipe_dietary_restrictions rdr
        JOIN public.dietary_restrictions dr on dr.id = rdr.dietary_restriction_id
      WHERE
        rdr.recipe_id = ${recipe.id};
    `);

    return {
      id: recipe.id,
      name: recipe.name,
      instructions: recipe.instructions,
      recipeIngredients: ingredients.map((ingredient) => ({
        id: ingredient.recipeIngredientId,
        ingredient: {
          id: ingredient.ingredientId,
          displayName: ingredient.displayName,
          name: ingredient.name,
        },
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })),
      dietaryRestrictions: dietaryRestrictions.map((dr) => ({
        id: dr.id,
        name: dr.name,
      })),
    };
  }
}

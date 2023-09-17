import { Injectable } from '@nestjs/common';
import { Recipe } from '../types';
import { PrismaService } from '../../db/services/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GetRecipeService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getRecipeById(id: number): Promise<Recipe> {
    return this.prismaService.$transaction(async (prismaTransaction) => {
      const recipe = await prismaTransaction.recipe.findUnique({
        where: { id },
      });

      const recipeIngredients = await prismaTransaction.$queryRaw<
        {
          ingredientId: number;
          recipeIngredientId: number;
          quantity: number;
          unit: string;
          name: string;
          displayName: string;
        }[]
      >(
        Prisma.sql`
          SELECT
            i.id as "ingredientId",
            ri.id as "recipeIngredientId",
            ri.quantity,
            ri.unit,
            i.name,
            i.display_name as "displayName"
          FROM
            public.recipe_ingredients ri
            JOIN public.ingredients i ON ri."ingredientId" = i.id
          WHERE
            ri."recipeId" = ${id};
      `,
      );

      const filterDiets = await prismaTransaction.$queryRaw<
        {
          id: number;
          name: string;
          displayName: string;
        }[]
      >(
        Prisma.sql`
          SELECT
            d.id,
            d.name,
            d.display_name as "displayName"
          FROM
            public.recipe_diets rd
            JOIN public.diets d ON rd.diet_id = d.id
          WHERE
            rd.recipe_id = ${id};
      `,
      );

      const filterAllergies = await prismaTransaction.$queryRaw<
        {
          id: number;
          name: string;
          displayName: string;
        }[]
      >(
        Prisma.sql`
          SELECT
            a.id,
            a.name,
            a.display_name as "displayName"
          FROM
            public.recipe_allergens ra
            JOIN public.allergens a ON ra.allergen_id = a.id
          WHERE
            ra.recipe_id = ${id};
      `,
      );

      return {
        ...recipe,
        recipeIngredients: recipeIngredients.map((ri) => {
          return {
            id: ri.recipeIngredientId,
            quantity: ri.quantity,
            unit: ri.unit,
            ingredient: {
              id: ri.ingredientId,
              name: ri.name,
              displayName: ri.displayName,
            },
          };
        }),
        filterDiets,
        filterAllergies,
      };
    });
  }
}

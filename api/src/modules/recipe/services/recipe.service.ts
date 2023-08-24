import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/services/prisma.service';
import { Ingredient, Recipe, RecipeInput } from '../types';
import { IngredientService } from './ingredient.service';
import { Prisma } from '@prisma/client';
import { Logger } from 'nestjs-pino';
import { OpenaiService } from '../../openai/services/openai.service';
import { UserService } from '../../user/services/user.service';
import { UserContextService } from '../../user/services/user-context.service';
import { DietaryRestrictionService } from '../../dietary-restriction/services/dietary-restriction.service';

@Injectable()
export class RecipeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ingredientService: IngredientService,
    private readonly logger: Logger,
    private readonly openaiService: OpenaiService,
    private readonly userService: UserService,
    private readonly userContextService: UserContextService,
    private readonly dietaryRestrictionService: DietaryRestrictionService,
  ) {}

  public async requestRecipeNames(): Promise<string[]> {
    this.logger.log('Requesting recipe names');

    const userId = await this.userContextService.userId;
    const dietaryRestrictions =
      await this.dietaryRestrictionService.getUserDietaryRestrictionNames(
        userId,
      );

    const recipeNames = await this.openaiService.requestRecipeNames({
      dietaryRestrictions,
    });

    return recipeNames;
  }

  public async requestRecipe(input: { recipeName: string }): Promise<Recipe> {
    // Double-check, does this recipe already exist?
    const existingRecipe = await this.getCachedRecipe(input.recipeName);

    if (existingRecipe) {
      this.logger.log('Recipe already exists', {
        recipeName: input.recipeName,
      });

      return existingRecipe;
    }

    const recipe = await this.openaiService.requestRecipe(input);

    const recipeInput: RecipeInput = {
      name: recipe.name,
      instructions: recipe.instructions,
      recipeIngredients: recipe.ingredients.map((ingredient) => ({
        ingredient: {
          name: ingredient.name,
        },
        quantity: ingredient.quantity || 0,
        unit: ingredient.unit,
      })),
    };

    this.logger.log('Saving recipe', {
      recipeInput,
    });
    const savedRecipe = await this.saveRecipe(recipeInput);

    await this.userService.associateRecipe({
      recipeId: savedRecipe.id,
    });

    this.logger.log('Completed recipe lookup');
    return {
      id: savedRecipe.id,
      name: savedRecipe.name,
      instructions: savedRecipe.instructions,
      recipeIngredients: savedRecipe.recipeIngredients.map((ri) => ({
        id: ri.id,
        quantity: ri.quantity,
        unit: ri.unit,
        ingredient: {
          id: ri.ingredient.id,
          name: ri.ingredient.name,
        },
      })),
    };
  }

  private async saveRecipe(recipe: RecipeInput): Promise<Recipe> {
    // First pluck the ingredients from the recipe
    const ingredients = recipe.recipeIngredients.map((ri) => ({
      name: ri.ingredient.name,
    }));

    // Start a prisma transaction
    let fullRecipe = undefined;
    await this.prisma.$transaction(async (prisma) => {
      // Upsert the ingredients
      const savedIngredients = await Promise.all<Ingredient>(
        ingredients.map(
          (ingredient) => this.ingredientService.upsertIngredient(ingredient),
          prisma,
        ),
      );

      // Save the recipe
      const savedRecipe = await prisma.recipe.create({
        data: {
          name: recipe.name,
          instructions: recipe.instructions,
        },
      });

      // Create the recipe ingredients individually. This is because Prisma doens't
      // return the created model or id when using createMany
      const savedRecipeIngredients = await Promise.all(
        savedIngredients.map((ingredient, index) => {
          // @TODO: This hack should be put into a lower layer
          const formattedQuantity =
            typeof recipe.recipeIngredients[index].quantity === 'string'
              ? parseInt(
                  recipe.recipeIngredients[index].quantity as unknown as string,
                )
              : recipe.recipeIngredients[index].quantity;

          return prisma.recipeIngredient.create({
            data: {
              ingredientId: ingredient.id,
              recipeId: savedRecipe.id,
              quantity: formattedQuantity,
              // quantity: recipe.recipeIngredients[index].quantity,
              // This is defaulting to 'count' because sometimes the unit is undefined
              unit: recipe.recipeIngredients[index].unit || 'count',
            },
          });
        }),
      );

      // Finally, return the recipe
      fullRecipe = {
        id: savedRecipe.id,
        name: savedRecipe.name,
        instructions: savedRecipe.instructions,
        recipeIngredients: savedRecipeIngredients.map((ri) => ({
          id: ri.id,
          quantity: ri.quantity,
          unit: ri.unit,
          ingredient: savedIngredients.find((i) => i.id === ri.ingredientId),
        })),
      };
    });

    if (fullRecipe) {
      return fullRecipe;
    } else {
      throw new Error('Failed to save recipe');
    }
  }

  private async getCachedRecipe(name: string): Promise<Recipe | null> {
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
        
        )
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

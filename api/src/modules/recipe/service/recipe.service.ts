import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/services/prisma.service';
import { Ingredient, Recipe, RecipeInput } from '../types';
import { IngredientService } from './ingredient.service';

@Injectable()
export class RecipeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ingredientService: IngredientService,
  ) {}

  public async saveRecipe(recipe: RecipeInput): Promise<Recipe> {
    // First pluck the ingredients from the recipe
    const ingredients = recipe.recipeIngredients.map((ri) => ({
      name: ri.ingredient.name,
    }));

    // Start a prisma transaction
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
        savedIngredients.map((ingredient, index) =>
          prisma.recipeIngredient.create({
            data: {
              ingredientId: ingredient.id,
              recipeId: savedRecipe.id,
              quantity: recipe.recipeIngredients[index].quantity,
              unit: recipe.recipeIngredients[index].unit,
            },
          }),
        ),
      );

      // Finally, return the recipe
      return {
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

    throw new Error('Failed to save recipe');
  }
}

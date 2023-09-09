import { Injectable } from '@nestjs/common';
import { RecipeInput, Recipe } from '../types';
import { PrismaService } from '../../db/services/prisma.service';
import { RecipeFilterService } from './recipe-filter.service';

@Injectable()
export class SaveRecipeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly recipeFilterService: RecipeFilterService,
  ) {}

  public async saveRecipe(input: RecipeInput): Promise<Recipe> {
    let fullRecipe = undefined;
    await this.prismaService.$transaction(async (prismaTransaction) => {
      // Create the base recipe
      const recipe = await prismaTransaction.recipe.create({
        data: {
          name: input.name,
          instructions: input.instructions,
        },
      });

      // Upsert ingredients
      const ingredients = await Promise.all(
        input.recipeIngredients.map((ri) =>
          this.recipeFilterService.upsertIngredient({
            ingredientInput: ri.ingredient,
            prismaTransaction,
          }),
        ),
      );

      // Associate ingredients with recipe
      await Promise.all(
        input.recipeIngredients.map((ri, index) => {
          return prismaTransaction.recipeIngredient.create({
            data: {
              recipeId: recipe.id,
              ingredientId: ingredients[index].id,
              quantity: ri.quantity,
              unit: ri.unit,
            },
          });
        }),
      );

      // Associate diet filter with recipe
      if (input.filterDiets) {
        const diets = await Promise.all(
          input.filterDiets.map((diet) =>
            this.recipeFilterService.upsertDiet({
              dietInput: diet,
              prismaTransaction,
            }),
          ),
        );

        await Promise.all(
          diets.map((diet) =>
            prismaTransaction.recipeDiet.create({
              data: {
                recipeId: recipe.id,
                dietId: diet.id,
              },
            }),
          ),
        );
      }

      // Associate allergen filter with recipe
      if (input.filterAllergens) {
        const allergens = await Promise.all(
          input.filterAllergens.map((allergen) =>
            this.recipeFilterService.upsertAllergen({
              allergenInput: allergen,
              prismaTransaction,
            }),
          ),
        );

        await Promise.all(
          allergens.map((allergen) =>
            prismaTransaction.recipeAllergen.create({
              data: {
                recipeId: recipe.id,
                allergenId: allergen.id,
              },
            }),
          ),
        );
      }

      const createdRecipe: Recipe = Object.assign({}, recipe, {
        recipeIngredients: [],
        filterIngredients: input.filterIngredients,
        filterAllergens: input.filterAllergens,
        filterDiets: input.filterDiets,
      });
      createdRecipe.recipeIngredients = input.recipeIngredients.map(
        (ri, index) => {
          return {
            id: index,
            ingredient: ingredients[index],
            quantity: ri.quantity,
            unit: ri.unit,
          };
        },
      );

      fullRecipe = createdRecipe;
    });

    return fullRecipe;
  }
}

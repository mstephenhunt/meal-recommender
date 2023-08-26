import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/services/prisma.service';
import { Ingredient, Recipe, RecipeInput } from '../types';
import { IngredientService } from './ingredient.service';
import { Logger } from 'nestjs-pino';
import { OpenaiService } from '../../openai/services/openai.service';
import { UserService } from '../../user/services/user.service';
import { UserContextService } from '../../user/services/user-context.service';
import { DietaryRestrictionService } from '../../dietary-restriction/services/dietary-restriction.service';
import { UserRecipeService } from './user-recipe.service';

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
    private readonly userRecipeService: UserRecipeService,
  ) {}

  public async requestRecipeNames(): Promise<string[]> {
    this.logger.log('Requesting recipe names');

    const userId = await this.userContextService.userId;
    const dietaryRestrictions =
      await this.dietaryRestrictionService.getUserDietaryRestrictions(userId);

    const recipeNames = await this.openaiService.requestRecipeNames({
      dietaryRestrictions: dietaryRestrictions.map((dr) => dr.name),
    });

    return recipeNames;
  }

  public async requestRecipe(input: { recipeName: string }): Promise<Recipe> {
    // Double-check, does this recipe already exist?
    const existingRecipe =
      await this.userRecipeService.getUserCachedRecipeByName(input.recipeName);

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
    return savedRecipe;
  }

  public async getUserSavedRecipes(): Promise<Recipe[]> {
    return this.userRecipeService.getUserSavedRecipes();
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

      // Get the dietary restrictions for this user
      const userId = await this.userContextService.userId;
      const dietaryRestrictions =
        await this.dietaryRestrictionService.getUserDietaryRestrictions(userId);

      // Associate the dietary restrictions to the recipe
      await Promise.all(
        dietaryRestrictions.map((dr) =>
          prisma.recipeDietaryRestriction.create({
            data: {
              recipeId: savedRecipe.id,
              dietaryRestrictionId: dr.id,
            },
          }),
        ),
      );

      // Create the recipe ingredients individually. This is because Prisma doens't
      // return the created model or id when using createMany
      const savedRecipeIngredients = await Promise.all(
        savedIngredients.map((ingredient, index) => {
          // @TODO: This hack should be put into a lower layer
          const formattedQuantity =
            typeof recipe.recipeIngredients[index].quantity === 'string'
              ? parseFloat(
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
        dietaryRestrictions,
      };
    });

    if (fullRecipe) {
      return fullRecipe;
    } else {
      throw new Error('Failed to save recipe');
    }
  }
}

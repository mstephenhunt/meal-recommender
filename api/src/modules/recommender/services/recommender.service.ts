import { Injectable } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenAIMeal } from '../types';
import { RecipeInput } from '../../recipe/types';
import { RecipeService } from '../../recipe/services/recipe.service';
import { UserContextService } from '../../user/services/user-context.service';
import { PrismaService } from '../../db/services/prisma.service';
import { Logger } from 'nestjs-pino';

@Injectable()
export class RecommenderService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly recipeService: RecipeService,
    private readonly userContextService: UserContextService,
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  public async requestRecipe(input: {
    recipeName: string;
  }): Promise<OpenAIMeal> {
    const recipe = await this.openaiService.requestRecipe(input);

    const recipeInput: RecipeInput = {
      name: recipe.name,
      instructions: recipe.instructions,
      recipeIngredients: recipe.ingredients.map((ingredient) => ({
        ingredient: {
          name: ingredient.name,
        },
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })),
    };

    this.logger.log('Saving recipe', {
      recipeInput,
    });
    const savedRecipe = await this.recipeService.saveRecipe(recipeInput);

    // Associate this recipe to the current user
    const userId = await this.userContextService.userId;

    this.logger.log('Associating recipe to user', {
      userId,
      recipeId: savedRecipe.id,
    });
    await this.prismaService.userRecipe.create({
      data: {
        userId,
        recipeId: savedRecipe.id,
      },
    });

    this.logger.log('Completed recipe lookup');
    return recipe;
  }
}

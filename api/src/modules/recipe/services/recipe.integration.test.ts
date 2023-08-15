import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import { IngredientService } from './ingredient.service'; // Import the IngredientService here
import { PrismaService } from '../../db/services/prisma.service'; // Import the PrismaService here
import { RecipeInput } from '../types';

describe('RecipeService', () => {
  let recipeService: RecipeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeService, IngredientService, PrismaService], // Include all required services here
    }).compile();

    recipeService = module.get<RecipeService>(RecipeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.recipeIngredient.deleteMany();
    await prismaService.recipe.deleteMany();
    await prismaService.ingredient.deleteMany();
  });

  it('should be able to save a recipe', async () => {
    const sampleRecipeInput: RecipeInput = {
      name: 'Delicious Pasta',
      instructions:
        '1. Boil the pasta\n2. Prepare the sauce\n3. Mix pasta and sauce',
      recipeIngredients: [
        {
          ingredient: {
            name: 'Pasta',
          },
          quantity: 200, // grams
          unit: 'g',
        },
        {
          ingredient: {
            name: 'Tomato Sauce',
          },
          quantity: 1, // can
          unit: 'can',
        },
        {
          ingredient: {
            name: 'Cheese',
          },
          quantity: 50, // grams
          unit: 'g',
        },
      ],
    };

    const savedRecipe = await recipeService.saveRecipe(sampleRecipeInput);

    expect(savedRecipe).toEqual({
      id: expect.any(Number),
      name: 'Delicious Pasta',
      instructions:
        '1. Boil the pasta\n2. Prepare the sauce\n3. Mix pasta and sauce',
      recipeIngredients: [
        {
          id: expect.any(Number),
          quantity: 200,
          unit: 'g',
          ingredient: {
            id: expect.any(Number),
            name: 'Pasta',
          },
        },
        {
          id: expect.any(Number),
          quantity: 1,
          unit: 'can',
          ingredient: {
            id: expect.any(Number),
            name: 'Tomato Sauce',
          },
        },
        {
          id: expect.any(Number),
          quantity: 50,
          unit: 'g',
          ingredient: {
            id: expect.any(Number),
            name: 'Cheese',
          },
        },
      ],
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SaveRecipeService } from './save-recipe.service';
import { PrismaService } from '../../db/services/prisma.service';
import { RecipeFilterService } from './recipe-filter.service';
import { LoggerModule } from 'nestjs-pino';
import { RecipeInput } from '../types';

describe('SaveRecipeService', () => {
  let saveRecipeService: SaveRecipeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [SaveRecipeService, PrismaService, RecipeFilterService],
    }).compile();

    saveRecipeService = module.get<SaveRecipeService>(SaveRecipeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    prismaService.recipe.deleteMany({});
    prismaService.ingredient.deleteMany({});
    prismaService.recipeIngredient.deleteMany({});
    prismaService.diet.deleteMany({});
    prismaService.recipeDiet.deleteMany({});
    prismaService.allergen.deleteMany({});
    prismaService.recipeAllergen.deleteMany({});
  });

  it('should be defined', () => {
    expect(saveRecipeService).toBeDefined();
  });

  it('should save a recipe', async () => {
    const recipeInput: RecipeInput = {
      name: 'Test Recipe',
      instructions: 'Test Instructions',
      recipeIngredients: [
        {
          ingredient: {
            name: 'Test Ingredient',
          },
          quantity: 1,
          unit: 'cup',
        },
      ],
    };

    const recipe = await saveRecipeService.saveRecipe(recipeInput);

    // Check return type
    expect(recipe).toMatchObject({
      id: expect.any(Number),
      name: 'Test Recipe',
      instructions: 'Test Instructions',
      recipeIngredients: [
        {
          id: expect.any(Number),
          ingredient: {
            id: expect.any(Number),
            name: 'test ingredient',
            displayName: 'Test Ingredient',
          },
          quantity: 1,
          unit: 'cup',
        },
      ],
    });
  });

  it('should save a recipe with filters', async () => {
    // Save a diet and an allerge
    const diet = await prismaService.diet.create({
      data: {
        name: 'test diet',
        displayName: 'Test Diet',
      },
    });

    const allergen = await prismaService.allergen.create({
      data: {
        name: 'test allergen',
        displayName: 'Test Allergen',
      },
    });

    const recipeInput: RecipeInput = {
      name: 'Test Recipe',
      instructions: 'Test Instructions',
      recipeIngredients: [
        {
          ingredient: {
            name: 'Test Ingredient',
          },
          quantity: 1,
          unit: 'cup',
        },
      ],
      filterDiets: [diet],
      filterAllergens: [allergen],
    };

    const recipe = await saveRecipeService.saveRecipe(recipeInput);

    // Check return type
    expect(recipe).toMatchObject({
      id: expect.any(Number),
      name: 'Test Recipe',
      instructions: 'Test Instructions',
      recipeIngredients: [
        {
          id: expect.any(Number),
          ingredient: {
            id: expect.any(Number),
            name: 'test ingredient',
            displayName: 'Test Ingredient',
          },
          quantity: 1,
          unit: 'cup',
        },
      ],
      filterDiets: [
        {
          id: expect.any(Number),
          name: 'test diet',
          displayName: 'Test Diet',
        },
      ],
      filterAllergens: [
        {
          id: expect.any(Number),
          name: 'test allergen',
          displayName: 'Test Allergen',
        },
      ],
    });
  });
});

import { Injectable } from '@nestjs/common';
import {
  PrismaService,
  normalizeString,
  titleCaseString,
} from '../../db/services/prisma.service';
import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import {
  Ingredient,
  IngredientInput,
  Diet,
  DietInput,
  Allergen,
  AllergenInput,
} from '../types';
import { Logger } from 'nestjs-pino';

@Injectable()
export class RecipeFilterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  public async upsertIngredient(input: {
    ingredientInput: IngredientInput;
    prismaTransaction?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >;
  }): Promise<Ingredient> {
    this.logger.log('Upserting Ingredient', {
      ingredientInput: input.ingredientInput,
      prismaTransaction: !!input.prismaTransaction,
    });

    const { ingredientInput, prismaTransaction } = input;

    const ingredient = {
      name: normalizeString(ingredientInput.name),
      displayName: titleCaseString(ingredientInput.name),
    };

    let savedIngredient;
    if (prismaTransaction) {
      savedIngredient = await prismaTransaction.ingredient.upsert({
        where: {
          name: ingredient.name,
        },
        update: ingredient,
        create: ingredient,
      });
    } else {
      savedIngredient = await this.prisma.ingredient.upsert({
        where: {
          name: ingredient.name,
        },
        update: ingredient,
        create: ingredient,
      });
    }

    if (!savedIngredient) {
      throw new Error('Failed to upsert ingredient');
    }

    this.logger.log('Completed upserting ingredient', {
      ingredientInput: input.ingredientInput,
      prismaTransaction: !!input.prismaTransaction,
      savedIngredient,
    });

    return {
      id: savedIngredient.id,
      name: savedIngredient.name,
      displayName: savedIngredient.displayName,
    };
  }

  public async upsertDiet(input: {
    dietInput: DietInput;
    prismaTransaction?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >;
  }): Promise<Diet> {
    this.logger.log('Upserting Diet', {
      dietInput: input.dietInput,
      prismaTransaction: !!input.prismaTransaction,
    });

    const { dietInput, prismaTransaction } = input;

    const diet = {
      name: normalizeString(dietInput.name),
      displayName: titleCaseString(dietInput.name),
    };

    let savedDiet;
    if (prismaTransaction) {
      savedDiet = await prismaTransaction.diet.upsert({
        where: {
          name: diet.name,
        },
        update: diet,
        create: diet,
      });
    } else {
      savedDiet = await this.prisma.diet.upsert({
        where: {
          name: diet.name,
        },
        update: diet,
        create: diet,
      });
    }

    if (!savedDiet) {
      throw new Error('Failed to upsert diet');
    }

    this.logger.log('Completed upserting diet', {
      dietInput: input.dietInput,
      prismaTransaction: !!input.prismaTransaction,
      savedDiet,
    });

    return {
      id: savedDiet.id,
      name: savedDiet.name,
      displayName: savedDiet.displayName,
    };
  }

  public async upsertAllergen(input: {
    allergenInput: AllergenInput;
    prismaTransaction?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >;
  }): Promise<Allergen> {
    this.logger.log('Upserting Allergen', {
      allergenInput: input.allergenInput,
      prismaTransaction: !!input.prismaTransaction,
    });

    const { allergenInput, prismaTransaction } = input;

    const allergen = {
      name: normalizeString(allergenInput.name),
      displayName: titleCaseString(allergenInput.name),
    };

    let savedAllergen;
    if (prismaTransaction) {
      savedAllergen = await prismaTransaction.allergen.upsert({
        where: {
          name: allergen.name,
        },
        update: allergen,
        create: allergen,
      });
    } else {
      savedAllergen = await this.prisma.allergen.upsert({
        where: {
          name: allergen.name,
        },
        update: allergen,
        create: allergen,
      });
    }

    if (!savedAllergen) {
      throw new Error('Failed to upsert allergen');
    }

    this.logger.log('Completed upserting allergen', {
      allergenInput: input.allergenInput,
      prismaTransaction: !!input.prismaTransaction,
      savedAllergen,
    });

    return {
      id: savedAllergen.id,
      name: savedAllergen.name,
      displayName: savedAllergen.displayName,
    };
  }
}

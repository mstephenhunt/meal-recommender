import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/services/prisma.service';
import { Ingredient } from '../types';
import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class IngredientService {
  constructor(private readonly prisma: PrismaService) {}

  // Takes in an ingredient and the prisma transaction client
  public async upsertIngredient(
    ingredient: { name: string },
    prismaTransaction?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ): Promise<Ingredient> {
    if (prismaTransaction) {
      const savedIngredient = await prismaTransaction.ingredient.upsert({
        where: {
          name: ingredient.name,
        },
        update: ingredient,
        create: ingredient,
      });

      return {
        id: savedIngredient.id,
        name: savedIngredient.name,
      };
    }

    const savedIngredient = await this.prisma.ingredient.upsert({
      where: {
        name: ingredient.name,
      },
      update: ingredient,
      create: ingredient,
    });

    return {
      id: savedIngredient.id,
      name: savedIngredient.name,
    };
  }
}

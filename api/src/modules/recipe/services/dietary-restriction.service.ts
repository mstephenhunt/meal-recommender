import { Injectable } from '@nestjs/common';
import {
  PrismaService,
  normalizeString,
} from '../../db/services/prisma.service';
import { Logger } from 'nestjs-pino';

type DietaryRestrictionInput = {
  name: string;
};

type DietaryRestriction = {
  id: number;
  name: string;
};

@Injectable()
export class DietaryRestrictionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  /**
   * If the dietary restriction exists in the DB, that'll be pulled. If not,
   * will be added and returned.
   */
  public async getOrCreateDietaryRestriction(
    input: DietaryRestrictionInput,
  ): Promise<DietaryRestriction> {
    const { name } = input;

    this.logger.log('Searching for dietary restriction', {
      name,
    });

    const normalizedDietaryRestrictionName = normalizeString(name);

    const dietaryRestriction = await this.prisma.dietaryRestriction.findFirst({
      where: {
        name: normalizedDietaryRestrictionName,
      },
    });

    if (dietaryRestriction) {
      this.logger.log('Found dietary restriction in DB', {
        normalizedDietaryRestrictionName,
      });

      return {
        id: dietaryRestriction.id,
        name: dietaryRestriction.displayName,
      };
    }

    const newDietaryRestriction = await this.prisma.dietaryRestriction.create({
      data: {
        displayName: name,
        name: normalizedDietaryRestrictionName,
      },
    });

    this.logger.log('Created new dietary restriction', {
      newDietaryRestriction,
    });

    return {
      id: newDietaryRestriction.id,
      name: newDietaryRestriction.displayName,
    };
  }
}

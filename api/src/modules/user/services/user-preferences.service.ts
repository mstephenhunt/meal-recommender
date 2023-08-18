import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import {
  PrismaService,
  titleCaseString,
} from '../../db/services/prisma.service';
import { DietaryRestrictionService } from '../../recipe/services/dietary-restriction.service';
import { UserContextService } from './user-context.service';
import { Prisma } from '@prisma/client';

type UserDietaryRestriction = {
  id: number;
  displayName: string;
};

type RawUserDietaryRestriction = {
  id: number;
  display_name: string;
};

@Injectable()
export class UserPreferencesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
    private readonly dietaryRestrictionService: DietaryRestrictionService,
    private readonly userContextService: UserContextService,
  ) {}

  public async addUserDietaryRestriction(input: {
    dietaryRestrictionName: string;
  }): Promise<void> {
    const { dietaryRestrictionName } = input;

    const titleCaseDietaryRestrictionName = titleCaseString(
      dietaryRestrictionName,
    );

    const userId = await this.userContextService.userId;

    const dietaryRestriction =
      await this.dietaryRestrictionService.getOrCreateDietaryRestriction({
        name: titleCaseDietaryRestrictionName,
      });

    this.logger.log('Adding dietary restriction to user', {
      userId,
      dietaryRestriction,
    });

    await this.prisma.usersDietaryResctrictions.create({
      data: {
        dietaryRestrictionId: dietaryRestriction.id,
        userId,
      },
    });
  }

  public async deleteUserDietaryPreference(input: {
    dietaryRestrictionName: string;
  }): Promise<void> {
    const { dietaryRestrictionName } = input;

    const titleCaseDietaryRestrictionName = titleCaseString(
      dietaryRestrictionName,
    );

    const userId = await this.userContextService.userId;

    const dietaryRestriction =
      await this.dietaryRestrictionService.getOrCreateDietaryRestriction({
        name: titleCaseDietaryRestrictionName,
      });

    this.logger.log('Deleting dietary restriction from user', {
      userId,
      dietaryRestriction,
    });

    // Lookup the user's dietary restriction mapping
    const userDietaryRestrictionMapping =
      await this.prisma.usersDietaryResctrictions.findFirst({
        where: {
          dietaryRestrictionId: dietaryRestriction.id,
          userId,
        },
      });

    // @TODO: Soft delete this mapping instead of hard deleting it
    await this.prisma.usersDietaryResctrictions.delete({
      where: {
        id: userDietaryRestrictionMapping.id,
      },
    });
  }

  public async getUserDietaryRestrictions(): Promise<UserDietaryRestriction[]> {
    const userId = await this.userContextService.userId;

    const userDietaryRestrictions = await this.prisma.$queryRaw<
      RawUserDietaryRestriction[]
    >(
      Prisma.sql`
          SELECT
            dr.id,
            dr.display_name
          FROM
            public.users_dietary_restrictions udr
            JOIN public.dietary_restrictions dr ON dr.id = udr.dietary_restriction_id
          WHERE
            udr.user_id = ${userId};        
        `,
    );

    return userDietaryRestrictions.map((userDietaryRestriction) => ({
      id: userDietaryRestriction.id,
      displayName: userDietaryRestriction.display_name,
    }));
  }
}

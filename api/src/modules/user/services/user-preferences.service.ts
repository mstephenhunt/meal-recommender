import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PrismaService } from '../../db/services/prisma.service';
import { DietaryRestrictionService } from '../../recipe/services/dietary-restriction.service';
import { UserContextService } from './user-context.service';

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

    const titleCaseDietaryRestrictionName = dietaryRestrictionName
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');

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
}

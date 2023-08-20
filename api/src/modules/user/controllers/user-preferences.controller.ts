import { Controller, Post, Body, UseGuards, Get, Delete } from '@nestjs/common';
import { UserPreferencesService } from '../services/user-preferences.service';
import { UserGuard } from '../../auth/guards/user.guard';
import { UserPreferenceEntity } from '../entities/user-preference.entity';

@Controller('api/user-preferences')
@UseGuards(UserGuard)
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  /**
   * Post endpoint that takes in a user's dietary restriction and adds it to
   * their profile.
   */
  @Post('/dietary-restriction')
  public async addUserDietaryRestriction(
    @Body() input: { dietaryRestrictionName: string },
  ): Promise<void> {
    await this.userPreferencesService.addUserDietaryRestriction(input);
  }

  @Get('/dietary-restriction')
  public async getCurrentDietaryRestrictions(): Promise<
    UserPreferenceEntity[]
  > {
    const dietaryRestrictions =
      await this.userPreferencesService.getUserDietaryRestrictions();

    return dietaryRestrictions.map((restriction) => {
      return new UserPreferenceEntity(restriction.id, restriction.displayName);
    });
  }

  @Delete('/dietary-restriction')
  public async deleteUserDietaryRestriction(
    @Body() input: { dietaryRestrictionName: string },
  ): Promise<void> {
    await this.userPreferencesService.deleteUserDietaryPreference(input);
  }
}

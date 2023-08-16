import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserPreferencesService } from '../services/user-preferences.service';
import { UserGuard } from '../../auth/guards/user.guard';

@Controller('user-preferences')
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  /**
   * Post endpoint that takes in a user's dietary restriction and adds it to
   * their profile.
   */
  @Post('/dietary-restriction')
  @UseGuards(UserGuard)
  public async addUserDietaryRestriction(
    @Body() input: { dietaryRestrictionName: string },
  ): Promise<void> {
    await this.userPreferencesService.addUserDietaryRestriction(input);
  }
}

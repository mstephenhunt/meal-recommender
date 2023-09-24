import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { FavoritesService } from '../services/favorites.service';
import { UserGuard } from '../../auth/guards/user.guard';

@Controller('api/me/favorites')
@UseGuards(UserGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  public async getMyFavoriteRecipeIds(): Promise<number[]> {
    return this.favoritesService.getMyFavoriteRecipeIds();
  }

  @Post()
  public async addMyFavoriteRecipe(
    @Body() input: { recipeId: number },
  ): Promise<void> {
    return this.favoritesService.addMyFavoriteRecipe(input);
  }

  @Delete()
  public async removeMyFavoriteRecipe(
    @Body() input: { recipeId: number },
  ): Promise<void> {
    return this.favoritesService.removeMyFavoriteRecipe(input);
  }
}

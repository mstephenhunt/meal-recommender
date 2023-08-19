import { Get, Controller, UseGuards, Body, Query } from '@nestjs/common';
import { RecommenderService } from '../services/recommender.service';
import { Logger } from 'nestjs-pino';
import { UserGuard } from '../../auth/guards/user.guard';
import { Recipe } from '../entities/recipe.entity';

@Controller('recommender')
@UseGuards(UserGuard)
export class RecommenderController {
  constructor(
    private readonly recommenderService: RecommenderService,
    private readonly logger: Logger,
  ) {}

  @Get('/generate-recipe')
  public async generateRecipe(
    @Query('recipeName') recipeName: string,
  ): Promise<Recipe> {
    this.logger.log('Generating recipe', {
      recipeName: recipeName,
    });

    const response = await this.recommenderService.requestRecipe({
      recipeName: recipeName,
    });

    return new Recipe(response);
  }

  @Get('/generate-user-recipe')
  public async generateUserRecipe(
    @Body() input: { recipeName: string },
  ): Promise<string> {
    this.logger.log('Generating user recipe', {
      recipeName: input.recipeName,
    });

    const response = await this.recommenderService.requestRecipe({
      recipeName: input.recipeName,
    });

    return response as unknown as string;
  }

  @Get('/suggest-next-meal')
  public async suggestNextMeal(): Promise<string> {
    this.logger.log('Suggesting next meal');

    const response = await this.recommenderService.suggestNextMeal();

    return response as unknown as string;
  }

  @Get('/request-recipe-names')
  public async requestRecipeNames(): Promise<{ recipeNames: string[] }> {
    this.logger.log('Requesting recipe names');

    const response = await this.recommenderService.requestRecipeNames();

    return {
      recipeNames: response,
    };
  }
}

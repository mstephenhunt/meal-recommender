import { Get, Controller, UseGuards, Body } from '@nestjs/common';
import { RecommenderService } from '../services/recommender.service';
import { APIGuard } from '../../auth/guards/api.guard';
import { Logger } from 'nestjs-pino';
import { UserGuard } from '../../auth/guards/user.guard';

@Controller('recommender')
export class RecommenderController {
  constructor(
    private readonly recommenderService: RecommenderService,
    private readonly logger: Logger,
  ) {}

  @UseGuards(APIGuard)
  @Get('/generate-recipe')
  public async generateRecipe(
    @Body() input: { recipeName: string },
  ): Promise<string> {
    this.logger.log('Generating recipe', {
      recipeName: input.recipeName,
    });

    const response = await this.recommenderService.requestRecipe({
      recipeName: input.recipeName,
    });

    return response as unknown as string;
  }

  @UseGuards(UserGuard)
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

  @UseGuards(UserGuard)
  @Get('/suggest-next-meal')
  public async suggestNextMeal(): Promise<string> {
    this.logger.log('Suggesting next meal');

    const response = await this.recommenderService.suggestNextMeal();

    return response as unknown as string;
  }

  @UseGuards(UserGuard)
  @Get('/request-recipe-names')
  public async requestRecipeNames(): Promise<{ recipeNames: string[] }> {
    this.logger.log('Requesting recipe names');

    const response = await this.recommenderService.requestRecipeNames();

    return {
      recipeNames: response,
    };
  }
}

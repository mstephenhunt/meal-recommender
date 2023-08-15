import { Get, Controller, UseGuards, Body } from '@nestjs/common';
import { RecommenderService } from '../services/recommender.service';
import { APIGuard } from '../../auth/guards/api.guard';

@Controller('recommender')
@UseGuards(APIGuard)
export class RecommenderController {
  constructor(private readonly recommenderService: RecommenderService) {}

  @Get('/generate-recipe')
  public async test(@Body() input: { recipeName: string }): Promise<string> {
    const response = await this.recommenderService.requestRecipe({
      recipeName: input.recipeName,
    });

    return response as unknown as string;
  }
}

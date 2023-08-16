import { Get, Controller, UseGuards, Body } from '@nestjs/common';
import { RecommenderService } from '../services/recommender.service';
import { APIGuard } from '../../auth/guards/api.guard';
import { Logger } from 'nestjs-pino';

@Controller('recommender')
@UseGuards(APIGuard)
export class RecommenderController {
  constructor(
    private readonly recommenderService: RecommenderService,
    private readonly logger: Logger,
  ) {}

  @Get('/generate-recipe')
  public async test(@Body() input: { recipeName: string }): Promise<string> {
    this.logger.log('Generating recipe', {
      recipeName: input.recipeName,
    });

    const response = await this.recommenderService.requestRecipe({
      recipeName: input.recipeName,
    });

    return response as unknown as string;
  }
}

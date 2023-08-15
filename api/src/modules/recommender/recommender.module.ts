import { Module } from '@nestjs/common';
import { OpenaiService } from './services/openai.service';
import { OpenaiTestControllerController } from './controllers/openai-test-controller.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UtilsModule } from '../utils/utils.module';
import { RecommenderController } from './controllers/recommender.controller';
import { RecommenderService } from './services/recommender.service';
import { RecipeModule } from '../recipe/recipe.module';

@Module({
  imports: [ConfigModule, HttpModule, UtilsModule, RecipeModule],
  controllers: [OpenaiTestControllerController, RecommenderController],
  providers: [OpenaiService, RecommenderService],
})
export class RecommenderModule {}

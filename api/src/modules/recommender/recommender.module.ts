import { Module } from '@nestjs/common';
import { OpenaiService } from './services/openai.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UtilsModule } from '../utils/utils.module';
import { RecommenderController } from './controllers/recommender.controller';
import { RecommenderService } from './services/recommender.service';
import { RecipeModule } from '../recipe/recipe.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { DbModule } from '../db/db.module';
import { DietaryRestrictionService } from '../recipe/services/dietary-restriction.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    UtilsModule,
    RecipeModule,
    AuthModule,
    UserModule,
    DbModule,
  ],
  controllers: [RecommenderController],
  providers: [OpenaiService, RecommenderService, DietaryRestrictionService],
  exports: [DietaryRestrictionService],
})
export class RecommenderModule {}

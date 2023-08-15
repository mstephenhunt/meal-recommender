import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { RecipeModule } from './modules/recipe/recipe.module';
import { ConfigModule } from '@nestjs/config';
import { RecommenderModule } from './modules/recommender/recommender.module';

@Module({
  imports: [
    UserModule,
    RecipeModule,
    ConfigModule.forRoot(),
    RecommenderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

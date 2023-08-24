import { Module } from '@nestjs/common';
import { RecipeService } from './services/recipe.service';
import { IngredientService } from './services/ingredient.service';
import { DbModule } from '../db/db.module';
import { DietaryRestrictionModule } from '../dietary-restriction/dietary-restriction.module';
import { OpenaiModule } from '../openai/openai.module';
import { UserModule } from '../user/user.module';
import { LoggerModule } from 'nestjs-pino';
import { RecipeController } from './controllers/recipe.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    DbModule,
    OpenaiModule,
    UserModule,
    LoggerModule.forRoot(),
    DietaryRestrictionModule,
    AuthModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeService, IngredientService],
})
export class RecipeModule {}

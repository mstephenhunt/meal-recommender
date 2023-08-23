import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db/db.module';
import { UserController } from './controllers/user.controller';
import { UserContextService } from './services/user-context.service';
import { UserPreferencesController } from './controllers/user-preferences.controller';
import { ConfigModule } from '@nestjs/config';
import { UserPreferencesService } from './services/user-preferences.service';
import { RecipeModule } from '../recipe/recipe.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    AuthModule,
    DbModule,
    ConfigModule.forRoot(),
    RecipeModule,
    LoggerModule.forRoot(),
  ],
  controllers: [UserController, UserPreferencesController],
  providers: [
    UserService,
    UserContextService,
    UserPreferencesService,
    UserContextService,
  ],
  exports: [UserService, UserContextService],
})
export class UserModule {}

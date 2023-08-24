import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db/db.module';
import { UserController } from './controllers/user.controller';
import { UserContextService } from './services/user-context.service';
import { UserPreferencesController } from './controllers/user-preferences.controller';
import { ConfigModule } from '@nestjs/config';
import { UserPreferencesService } from './services/user-preferences.service';
import { LoggerModule } from 'nestjs-pino';
import { DietaryRestrictionModule } from '../dietary-restriction/dietary-restriction.module';

@Module({
  imports: [
    AuthModule,
    DbModule,
    ConfigModule.forRoot(),
    LoggerModule.forRoot(),
    DietaryRestrictionModule,
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

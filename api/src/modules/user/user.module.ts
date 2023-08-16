import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db/db.module';
import { UserController } from './controllers/user.controller';
import { UserContextService } from './services/user-context.service';

@Module({
  controllers: [UserController],
  imports: [AuthModule, DbModule],
  providers: [UserService, UserContextService],
  exports: [UserService, UserContextService],
})
export class UserModule {}

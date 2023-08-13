import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db/db.module';
import { UserController } from './controllers/user.controller';

@Module({
  controllers: [UserController],
  imports: [AuthModule, DbModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

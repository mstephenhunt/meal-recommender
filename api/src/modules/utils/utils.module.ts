import { Module } from '@nestjs/common';
import { RequestCacheService } from './services/request-cache.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [RequestCacheService],
  exports: [RequestCacheService],
})
export class UtilsModule {}

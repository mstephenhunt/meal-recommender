import { Module } from '@nestjs/common';
import { OpenaiService } from './services/openai.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [HttpModule, ConfigModule, UtilsModule],
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}

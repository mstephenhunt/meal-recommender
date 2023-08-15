import { Module } from '@nestjs/common';
import { OpenaiService } from './services/openai.service';
import { OpenaiTestControllerController } from './controllers/openai-test-controller.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [ConfigModule, HttpModule, UtilsModule],
  controllers: [OpenaiTestControllerController],
  providers: [OpenaiService],
})
export class RecommenderModule {}

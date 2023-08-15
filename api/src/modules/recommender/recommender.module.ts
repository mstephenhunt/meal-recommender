import { Module } from '@nestjs/common';
import { OpenaiService } from './services/openai.service';
import { OpenaiTestControllerController } from './controllers/openai-test-controller.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [OpenaiTestControllerController],
  providers: [OpenaiService],
})
export class RecommenderModule {}

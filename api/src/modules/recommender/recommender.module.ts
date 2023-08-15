import { Module } from '@nestjs/common';
import { OpenaiService } from './services/openai.service';
import { OpenaiTestControllerController } from './controllers/openai-test-controller.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [OpenaiTestControllerController],
  providers: [OpenaiService],
})
export class RecommenderModule {}

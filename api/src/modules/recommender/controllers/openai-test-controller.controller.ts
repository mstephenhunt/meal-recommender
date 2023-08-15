import { Controller, Get, UseGuards } from '@nestjs/common';
import { APIGuard } from 'src/modules/auth/guards/api.guard';
import { OpenaiService } from '../services/openai.service';

@Controller('/internal/chat')
@UseGuards(APIGuard)
export class OpenaiTestControllerController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get('/test')
  public async testChat(): Promise<string> {
    return this.openaiService.testChat();
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { LlmService } from './llm.service';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('generate-text')
  async generateText(@Body() body: { prompt: string }): Promise<string> {
    return this.llmService.generateText(body.prompt);
  }
}

import { Controller, Post, Body, Get } from '@nestjs/common';
import { LlmService } from './llm.service';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('generate-text')
  async generateText(@Body() body: { prompt: string }): Promise<string> {
    return this.llmService.generateText(body.prompt);
  }

  @Get('generate-matchday-prediction')
  async generateMatchdayPrediction(): Promise<string> {
    return this.llmService.generateMatchdayPrediction();
  }

  @Get('send-prediction-to-discord')
  async sendPredictionToDiscord(): Promise<any> {
    return this.llmService.sendPredictionToDiscord();
  }
}

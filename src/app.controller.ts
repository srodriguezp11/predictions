import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('generate-matchday-prediction')
  async generateMatchdayPrediction(): Promise<any> {
    return this.appService.generateMatchdayPrediction();
  }

  @Get('send-prediction-to-discord')
  async sendPredictionToDiscord(): Promise<any> {
    return this.appService.sendPredictionToDiscord();
  }
}

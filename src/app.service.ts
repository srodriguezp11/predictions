import { Injectable } from '@nestjs/common';
import { LlmService } from './llm/llm.service';
import { DiscordService } from './discord/discord.service';
import { FootballDataService } from './football-data/football-data.service';
@Injectable()
export class AppService {
  constructor(
    private readonly discordService: DiscordService,
    private readonly llmService: LlmService,
    private readonly footballDataService: FootballDataService,
  ) {}

  getHello(): string {
    return 'Premier League Predictor!';
  }

  async generateMatchdayPrediction(): Promise<any> {
    const summary = await this.footballDataService.getMatchSummaryForLLM('PL');
    const prompt = `Genera una predicción para los proximos partidos de la liga inglesa. Debes incluir quien sera el vencedor de cada uno de los encuentros, la cantidad de goles y la probabilidad de acertar el pronostico.
    ${summary}
    `;
    return this.llmService.generateText(prompt);
  }

  async sendPredictionToDiscord(): Promise<any> {
    const initialMessage = [
      '¡Que tal Muchachos! Román les habla, el único 10, el más grande.',
      'Se viene la Premier League con todo.',
      '¡Y sí, no se preocupen! En breve les mando los resultados de la próxima fecha.',
      'Nada de nervios, yo me encargaré de que estén bien informados,',
      'porque al igual que en la cancha, no dejamos nada al azar.',
      '¡Nos vemos pronto, cuídense!',
      'Y a disfrutar del fútbol, que como siempre, hay magia en cada pase. 🔥⚽',
    ].join('\n');
    await this.discordService.sendMessage(initialMessage);

    const prediction = await this.generateMatchdayPrediction();

    const MAX_LENGTH = 500;
    if (prediction.length <= MAX_LENGTH) {
      return this.discordService.sendMessage(prediction);
    }

    const parts = prediction.match(new RegExp(`.{1,${MAX_LENGTH}}`, 'g')) || [];

    for (const part of parts) await this.discordService.sendMessage(part);

    return { message: 'Prediction sent to Discord' };
  }
}

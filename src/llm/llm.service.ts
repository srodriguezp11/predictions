import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { FootballDataService } from '../football-data/football-data.service';
import { Mistral } from '@mistralai/mistralai';
import { DiscordService } from '../discord/discord.service';

@Injectable()
export class LlmService {
  private readonly apiKey: string;
  private readonly mistralClient: Mistral;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly footballDataService: FootballDataService,
    private readonly discordService: DiscordService,
  ) {
    this.apiKey = this.configService.get('MISTRAL_API_KEY');
    this.mistralClient = new Mistral({ apiKey: this.apiKey });
  }

  async generateText(prompt: string): Promise<any> {
    const chatResponse = await this.mistralClient.chat.complete({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: prompt }],
    });
    return chatResponse.choices[0].message.content;
  }

  async generateMatchdayPrediction(): Promise<any> {
    const summary = await this.footballDataService.getMatchSummaryForLLM('PL');
    const prompt = `Genera una predicción para los proximos partidos de la liga inglesa. Debes incluir quien sera el vencedor de cada uno de los encuentros, la cantidad de goles y la probabilidad de acertar el pronostico.
    ${summary}
    `;
    return this.generateText(prompt);
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

    for (const part of parts) {
      await this.discordService.sendMessage(part);
    }

    return true;
  }
}

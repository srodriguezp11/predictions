import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { FootballDataService } from '../football-data/football-data.service';
import { Mistral } from '@mistralai/mistralai';

@Injectable()
export class LlmService {
  private readonly apiKey: string;
  private readonly mistralClient: Mistral;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly footballDataService: FootballDataService,
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
}

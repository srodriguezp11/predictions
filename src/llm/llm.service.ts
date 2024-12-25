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
}

import { Injectable, Logger } from '@nestjs/common';
import { Client, TextChannel } from 'discord.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordService {
  private readonly client: Client;
  private readonly logger = new Logger(DiscordService.name);
  private readonly channelId: string;
  constructor(private configService: ConfigService) {
    this.channelId = this.configService.get('DC_CHANNEL_ID');
    this.client = new Client({
      intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
    });
    this.client.login(this.configService.get('DC_BOT_TOKEN'));
    this.client.on('ready', () => {
      this.logger.log('Bot de Discord está conectado!');
    });
  }

  async sendMessage(message: string): Promise<void> {
    try {
      const channel = (await this.client.channels.fetch(
        this.channelId,
      )) as TextChannel;
      await channel.send(message);
    } catch (error) {
      this.logger.error(`Error al enviar mensaje: ${error.message}`);
      throw error;
    }
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { DiscordService } from './discord.service';

@Controller('discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Post('send-message')
  async sendMessage(@Body() body: { message: string }) {
    await this.discordService.sendMessage(body.message);
    return { success: true, message: 'Mensaje enviado correctamente' };
  }
}

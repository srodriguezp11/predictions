import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FootballDataModule } from '../football-data/football-data.module';
import { LlmService } from './llm.service';
import { LlmController } from './llm.controller';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [HttpModule, FootballDataModule, DiscordModule],
  controllers: [LlmController],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}

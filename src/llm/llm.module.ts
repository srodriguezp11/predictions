import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FootballDataModule } from '../football-data/football-data.module';
import { LlmService } from './llm.service';
import { LlmController } from './llm.controller';

@Module({
  imports: [HttpModule, FootballDataModule],
  controllers: [LlmController],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}

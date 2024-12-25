import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FootballDataController } from './football-data.controller';
import { FootballDataService } from './football-data.service';

@Module({
  imports: [HttpModule],
  controllers: [FootballDataController],
  providers: [FootballDataService],
  exports: [FootballDataService],
})
export class FootballDataModule {}

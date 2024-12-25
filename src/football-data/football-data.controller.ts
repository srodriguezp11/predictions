import { Controller, Get } from '@nestjs/common';
import { FootballDataService } from './football-data.service';
import { Observable, from } from 'rxjs';

@Controller('football-data')
export class FootballDataController {
  constructor(private readonly footballDataService: FootballDataService) {}

  @Get('competition')
  getCompetition(): Observable<any> {
    return this.footballDataService.getCompetition('PL');
  }

  @Get('standings')
  getStandings(): Observable<any> {
    return this.footballDataService.getStandings('PL');
  }

  @Get('goal-scorers')
  getGoalScorers(): Observable<any> {
    return this.footballDataService.getGoalScorers('PL');
  }

  @Get('next-matches')
  async getNextMatches(): Promise<Observable<any>> {
    return this.footballDataService.getNextMatches('PL');
  }

  @Get('head2head')
  getHead2Head(): Observable<any> {
    return this.footballDataService.getHead2Head('PL');
  }

  @Get('next-matches-with-h2h')
  async getNextMatchesWithH2H(): Promise<any> {
    return this.footballDataService.getNextMatchesWithH2H('PL');
  }

  @Get('summary')
  getSummary(): Observable<any> {
    return from(this.footballDataService.getMatchSummaryForLLM('PL'));
  }
}

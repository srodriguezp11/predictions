import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, map, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import {
  StandingsResponse,
  CompetitionResponse,
  ScorersResponse,
  MatchesResponse,
  HeadToHeadResponse,
} from './football-data.interface';

@Injectable()
export class FootballDataService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get('FOOTBALL_DATA_API_URL');
    this.apiKey = this.configService.get('FOOTBALL_DATA_API_KEY');
  }

  private makeApiCall<T>(endpoint: string): Observable<T> {
    return this.httpService
      .get(`${this.apiUrl}${endpoint}`, {
        headers: {
          'X-Auth-Token': this.apiKey,
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          if (error.response) {
            throw new HttpException(
              error.response.data.message || 'Error en la API de Football Data',
              error.response.status,
            );
          }
          throw new HttpException(
            'Error al conectar con el servicio',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }),
      );
  }

  getCompetition(competition: string): Observable<CompetitionResponse> {
    return this.makeApiCall(`/competitions/${competition}`);
  }

  getStandings(competition: string): Observable<StandingsResponse> {
    return this.makeApiCall(`/competitions/${competition}/standings`);
  }

  getGoalScorers(competition: string): Observable<ScorersResponse> {
    return this.makeApiCall(`/competitions/${competition}/scorers`);
  }

  async getNextMatches(
    competition: string,
  ): Promise<Observable<MatchesResponse>> {
    const competitionData = await firstValueFrom(
      this.makeApiCall<CompetitionResponse>(`/competitions/${competition}`),
    );
    return this.makeApiCall(
      `/competitions/${competition}/matches?matchday=${competitionData.seasons[0].currentMatchday}`,
    );
  }

  getHead2Head(code: string): Observable<HeadToHeadResponse> {
    return this.makeApiCall(`/matches/${code}/head2head?limit=15`);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getNextMatchesWithH2H(competition: string): Promise<{
    matches: Array<{
      match: {
        id: number;
        matchday: number;
        homeTeam: string;
        awayTeam: string;
      };
      previousMatches: Array<{
        date: string;
        matchday: number;
        homeTeam: string;
        awayTeam: string;
        score: any;
        winner: string;
      }>;
    }>;
    standings: Array<{
      position: number;
      team: string;
      points: number;
      goalDifference: number;
      won: number;
      lost: number;
      draw: number;
      played: number;
    }>;
  }> {
    const nextMatches = await firstValueFrom(
      await this.getNextMatches(competition),
    );

    const nextMatchesFormatted = nextMatches.matches.map((match) => ({
      match: {
        id: match.id,
        matchday: match.matchday,
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
      },
      previousMatches: [],
    }));

    for (const [index, match] of nextMatchesFormatted.entries()) {
      if (index > 0) await this.delay(6500);

      const headToHead = await firstValueFrom(
        this.getHead2Head(match.match.id.toString()),
      );
      const formattedHeadToHead = headToHead.matches.map((match) => ({
        date: match.utcDate,
        matchday: match.matchday,
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        winner: match.score.winner,
        score: match.score.fullTime,
      }));
      match.previousMatches = formattedHeadToHead;
    }

    const actualStandings = await firstValueFrom(
      this.getStandings(competition),
    );

    const formattedStandings = actualStandings.standings[0].table.map(
      (entry) => ({
        position: entry.position,
        team: entry.team.name,
        points: entry.points,
        goalDifference: entry.goalDifference,
        won: entry.won,
        lost: entry.lost,
        draw: entry.draw,
        played: entry.playedGames,
      }),
    );

    await this.delay(1000);

    return { matches: nextMatchesFormatted, standings: formattedStandings };
  }

  async getMatchSummaryForLLM(competition: string): Promise<string> {
    const data = await this.getNextMatchesWithH2H(competition);

    const matchSummaries = data.matches
      .map((match) => {
        const h2hStats = this.calculateH2HStats(match.previousMatches);

        return `${match.match.homeTeam} vs ${match.match.awayTeam}:
      - Últimos ${match.previousMatches.length} enfrentamientos: 
      - Victorias local: ${h2hStats.homeWins}
      - Victorias visitante: ${h2hStats.awayWins}
      - Empates: ${h2hStats.draws}
      - Goles promedio local: ${h2hStats.avgHomeGoals}
      - Goles promedio visitante: ${h2hStats.avgAwayGoals}`;
      })
      .join('\n\n');

    const standingsReport = data.standings
      .map(
        (team) =>
          `${team.position}. ${team.team}: ${team.points}pts (G${team.won}-E${team.draw}-P${team.lost})`,
      )
      .join('\n');

    return `Resumen de la jornada:

PRÓXIMOS PARTIDOS Y HEAD TO HEAD:
${matchSummaries}

TABLA:
${standingsReport}`;
  }

  private calculateH2HStats(matches: any[]): {
    homeWins: number;
    awayWins: number;
    draws: number;
    avgHomeGoals: number;
    avgAwayGoals: number;
  } {
    const stats = {
      homeWins: 0,
      awayWins: 0,
      draws: 0,
      totalHomeGoals: 0,
      totalAwayGoals: 0,
    };

    matches.forEach((match) => {
      if (match.winner === 'HOME_TEAM') stats.homeWins++;
      else if (match.winner === 'AWAY_TEAM') stats.awayWins++;
      else stats.draws++;

      stats.totalHomeGoals += match.score.home;
      stats.totalAwayGoals += match.score.away;
    });

    const matchCount = matches.length || 1;

    return {
      homeWins: stats.homeWins,
      awayWins: stats.awayWins,
      draws: stats.draws,
      avgHomeGoals: Number((stats.totalHomeGoals / matchCount).toFixed(2)),
      avgAwayGoals: Number((stats.totalAwayGoals / matchCount).toFixed(2)),
    };
  }
}

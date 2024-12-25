export interface Filters {
  season: string;
}

export interface Area {
  id: number;
  name: string;
  code: string;
  flag: string;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
}

export interface Season {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  winner: string | null;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface StandingEntry {
  position: number;
  team: Team;
  playedGames: number;
  form: string | null;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface Standing {
  stage: string;
  type: string;
  group: string | null;
  table: StandingEntry[];
}

export interface StandingsResponse {
  filters: Filters;
  area: Area;
  competition: Competition;
  season: Season;
  standings: Standing[];
}

export interface TeamDetails extends Team {
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  lastUpdated: string;
}

export interface CompetitionResponse {
  area: Area;
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
  currentSeason: Season;
  seasons: Season[];
  lastUpdated: string;
}

export interface Player {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  section: string;
  position: string | null;
  shirtNumber: number | null;
  lastUpdated: string;
}

export interface Scorer {
  player: Player;
  team: TeamDetails;
  playedMatches: number;
  goals: number;
  assists: number | null;
  penalties: number | null;
}

export interface ScorersResponse {
  count: number;
  filters: {
    season: string;
    limit: number;
  };
  competition: Competition;
  season: Season;
  scorers: Scorer[];
}

export interface MatchScore {
  winner: string | null;
  duration: string;
  fullTime: {
    home: number | null;
    away: number | null;
  };
  halfTime: {
    home: number | null;
    away: number | null;
  };
}

export interface Match {
  area: Area;
  competition: Competition;
  season: Season;
  id: number;
  utcDate: string;
  status: string;
  matchday: number;
  stage: string;
  group: string | null;
  lastUpdated: string;
  homeTeam: Team;
  awayTeam: Team;
  score: MatchScore;
  odds: {
    msg: string;
  };
  referees: any[];
}

export interface ResultSet {
  count: number;
  first: string;
  last: string;
  played: number;
}

export interface MatchesResponse {
  filters: {
    season: string;
    matchday: string;
  };
  resultSet: ResultSet;
  competition: Competition;
  matches: Match[];
}

export interface Referee {
  id: number;
  name: string;
  type: string;
  nationality: string;
}

export interface WinnerTeam extends TeamDetails {
  shortName: string;
  tla: string;
  crest: string;
}

export interface Aggregates {
  numberOfMatches: number;
  totalGoals: number;
  homeTeam: {
    id: number;
    name: string;
    wins: number;
    draws: number;
    losses: number;
  };
  awayTeam: {
    id: number;
    name: string;
    wins: number;
    draws: number;
    losses: number;
  };
}

export interface HeadToHeadResultSet extends ResultSet {
  competitions: string;
}

export interface HeadToHeadResponse {
  filters: {
    limit: string;
    permission: string;
  };
  resultSet: HeadToHeadResultSet;
  aggregates: Aggregates;
  matches: Match[];
}

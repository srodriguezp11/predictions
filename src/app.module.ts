import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FootballDataModule } from './football-data/football-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    FootballDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public static port: number;
  public static bsUrl: string;
  constructor(private readonly config: ConfigService) {
    AppModule.port = config.port;
    AppModule.bsUrl = config.bsUrl;
  }
}

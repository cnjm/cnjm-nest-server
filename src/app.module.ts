import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UserModule } from './logical/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.dbType,
          host: configService.dbHost,
          port: configService.dbPort,
          username: configService.dbUser,
          password: configService.dbPwd,
          database: configService.dbDb,
          entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
          synchronize: true,
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    ConfigModule,
    UserModule,
  ],
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

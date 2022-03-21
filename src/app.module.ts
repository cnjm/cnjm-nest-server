import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "@chenjm/nestjs-redis";
import configuration from "/@/common/config/configuration";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthMiddleware } from "/@/common/middleware/auth.middleware";
import { AdministratorsModule } from "./logical/admin/module/administrators.module";
import { RoleModule } from "./logical/admin/module/role.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dataBase = configService.get("dataBase");
        return {
          type: dataBase.dbType,
          host: dataBase.dbHost,
          port: dataBase.dbPort,
          username: dataBase.dbUser,
          password: dataBase.dbPwd,
          database: dataBase.dbDb,
          entities: [__dirname + "/entities/**/*.entity{.ts,.js}"],
          synchronize: true,
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          closeClient: true,
          readyLog: true,
          config: configService.get("redis"),
        };
      },
    }),
    AdministratorsModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 账户权限中间件
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: "/api/admin/administrators/login",
          method: RequestMethod.POST,
        },
        // {
        //   path: "/api/admin/administrators/addAccount",
        //   method: RequestMethod.POST,
        // },
      )
      .forRoutes("/admin", "/common");
  }
}

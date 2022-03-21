import { Module, SetMetadata } from "@nestjs/common";
import { MODULE_PATH } from "@nestjs/common/constants";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisCacheService } from "/@/common/redis/redisCache.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User } from "/@/entities/User.entity";
import { httpConfig } from "/@/common/config/httpConfig";
import { UserController } from "../controller/user.controller";
import { UserService } from "../service/user.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("jwt.secret"),
        signOptions: { expiresIn: configService.get<string>("jwt.expiresIn") }, // token 过期时效
      }),
    }),
    TypeOrmModule.forFeature([User]),
    HttpModule.register(httpConfig),
  ],
  controllers: [UserController],
  providers: [UserService, RedisCacheService],
  exports: [UserService],
})
@SetMetadata(MODULE_PATH, "/weapp")
export class UserModule {
  //
}

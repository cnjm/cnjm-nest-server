import { forwardRef, Module, SetMetadata } from "@nestjs/common";
import { RoleService } from "../service/role.service";
import { LocalStrategy } from "../auth/local.strategy";
import { JwtStrategy } from "../auth/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AdministratorsModule } from "./administrators.module";
import { ConfigService } from "@nestjs/config";
import { RedisCacheService } from "/@/common/redis/redisCache.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MODULE_PATH } from "@nestjs/common/constants";
import { Role } from "/@/entities/Role.entity";
import { RoleController } from "../controller/auth.controller";

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
    TypeOrmModule.forFeature([Role]),
    forwardRef(() => AdministratorsModule),
  ],
  controllers: [RoleController],
  providers: [RoleService, LocalStrategy, JwtStrategy, RedisCacheService],
  exports: [RoleService],
})
@SetMetadata(MODULE_PATH, "/admin")
export class RoleModule {
  constructor() {
    //
  }
}

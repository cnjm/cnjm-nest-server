import { forwardRef, Module, SetMetadata } from "@nestjs/common";
import { MODULE_PATH } from "@nestjs/common/constants";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "../../../entities/Admin.entity";
import { Role } from "../../../entities/Role.entity";
import { RoleModule } from "./role.module";
import { RedisCacheService } from "/@/common/redis/redisCache.service";
import { AdministratorsController } from "../controller/administrators.controller";
import { AdministratorsService } from "../service/administrators.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Role]),
    forwardRef(() => RoleModule),
  ],
  controllers: [AdministratorsController],
  providers: [AdministratorsService, RedisCacheService],
  exports: [AdministratorsService],
})
@SetMetadata(MODULE_PATH, "/admin") // 属于一个admin的大模块，加个前缀路径
export class AdministratorsModule {
  //
}

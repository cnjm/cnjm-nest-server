import {
  Body,
  Request,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Roles } from "../auth/roles.decorator";
import { RoleService } from "../service/role.service";
import { RolesGuard } from "../auth/roles.guard";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AddAuthDto, DelAuthDto, GetAuthListDto } from "../dto/role.dto";
import { RoleEnum } from "../../../enum/role.enum";

@ApiTags("auth")
@Controller("auth")
@UseGuards(RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {
    //
  }
  @Get("getAuth")
  @Roles(RoleEnum.SUPER)
  @ApiOperation({ summary: "获取全部权限，无分页，适用给账号选择" })
  async getAuth() {
    return this.roleService.getAuth();
  }

  @Get("getAuthList")
  @Roles(RoleEnum.SUPER)
  @ApiOperation({ summary: "获取权限列表" })
  async getAuthList(@Query() query: GetAuthListDto) {
    return this.roleService.getAuthList(query);
  }

  @Post("addAuth")
  @Roles(RoleEnum.SUPER)
  @ApiOperation({ summary: "添加权限" })
  async addAuth(@Body() params: AddAuthDto): Promise<string> {
    return this.roleService.addAuth(params);
  }

  @Post("delAuth")
  @Roles(RoleEnum.SUPER)
  @ApiOperation({ summary: "删除权限" })
  async delAuth(@Body() params: DelAuthDto): Promise<string> {
    return this.roleService.delAuth(params);
  }
}

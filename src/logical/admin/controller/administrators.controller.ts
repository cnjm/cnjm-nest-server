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
import { AdministratorsService } from "../service/administrators.service";
import { RoleService } from "../service/role.service";
import { RolesGuard } from "../auth/roles.guard";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RoleEnum } from "../../../enum/role.enum";
import {
  AddAccountDto,
  DelAccountDto,
  EditAccountByOwnDto,
  EditAccountDto,
  GetAccountListDto,
  LoginDto,
  ModifyAccountDto,
} from "../dto/administrators.dto";

@ApiTags("administrators")
@Controller("administrators")
@UseGuards(RolesGuard)
export class AdministratorsController {
  constructor(
    private readonly roleService: RoleService,
    private readonly administratorsService: AdministratorsService,
  ) {}

  @Post("login")
  @ApiOperation({ summary: "用户登录" })
  async login(@Body() params: LoginDto) {
    // JWT验证 - Step 1: 用户请求登录
    const authResult = await this.roleService.validateUser(
      params.account,
      params.password,
    );
    return this.roleService.certificate(authResult);
  }

  @Get("getUserInfo")
  @ApiOperation({ summary: "获取个人信息" })
  async getUserInfo(@Request() request) {
    return this.administratorsService.getUserInfo(request.user);
  }

  @Get("getAccountList")
  @Roles(RoleEnum.SUPER)
  @ApiOperation({ summary: "获取账户列表" })
  async getAccountList(@Query() query: GetAccountListDto) {
    return this.administratorsService.getAccountList(query);
  }

  @Post("addAccount")
  @Roles(RoleEnum.SUPER)
  @ApiOperation({ summary: "添加管理员账号" })
  async addAccount(@Body() params: AddAccountDto): Promise<string> {
    return this.administratorsService.addAccount(params);
  }

  @Post("editAccount")
  @Roles(RoleEnum.SUPER)
  @ApiOperation({ summary: "编辑管理员账号" })
  async editAccount(@Body() params: EditAccountDto): Promise<string> {
    return this.administratorsService.editAccount(params);
  }

  @Post("editAccountByOwn")
  @ApiOperation({ summary: "编辑个人账号" })
  async editAccountByOwn(
    @Body() params: EditAccountByOwnDto,
    @Request() request,
  ) {
    return this.administratorsService.editAccountByOwn(params, request.user);
  }

  @Post("delAccount")
  @Roles(RoleEnum.SUPER)
  @ApiOperation({ summary: "删除账号" })
  async delAccount(@Body() params: DelAccountDto) {
    return this.administratorsService.delAccount(params);
  }

  @Post("modifyAccount")
  @Roles(RoleEnum.SUPER)
  @ApiOperation({ summary: "禁用/开启账号" })
  async modifyAccount(@Body() params: ModifyAccountDto) {
    return this.administratorsService.modifyAccount(params);
  }

  @Get("logout")
  @ApiOperation({ summary: "用户登出" })
  async logout(@Request() request) {
    const user = request.user;
    if (!user) {
      return "gbResponse(6)";
    }
    return this.administratorsService.logout(user);
  }
}

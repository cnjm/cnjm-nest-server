import {
  Body,
  Request,
  Controller,
  Post,
  UseGuards,
  Get,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "../../admin/auth/roles.guard";
import { LoginDto } from "../dto/user.dto";
import { UserService } from "../service/user.service";

@ApiTags("user")
@Controller("user")
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {
    //
  }

  @Post("login")
  @ApiOperation({ summary: "微信小程序登录" })
  async login(@Body() params: LoginDto): Promise<string> {
    const code = params.code;
    return this.userService.login(code);
  }

  @Get("getUserInfo")
  @ApiOperation({ summary: "获取用户信息" })
  async getUserInfo(@Request() request): Promise<any> {
    return this.userService.getUserInfo(request.user);
  }

  @Post("bindUserInfo")
  @ApiOperation({ summary: "绑定用户" })
  async bindUserInfo(@Body() params: any, @Request() request): Promise<any> {
    return this.userService.bindUserInfo(params, request.user);
  }
}

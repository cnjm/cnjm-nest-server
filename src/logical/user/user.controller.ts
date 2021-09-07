import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  /**
   * 获取账号列表
   */
  @Get()
  async getList() {
    // 参数将再此获取，并调用具体逻辑处理代码，然后处理返回
    return this.userService.getList();
  }
}

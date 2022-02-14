/*
 * @Description: 这是**页面（组件）
 * @Date: 2021-12-27 11:07:03
 * @Author: chenjiaming
 * @LastEditors: chenjiaming
 * @LastEditTime: 2022-01-04 16:17:41
 */
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  /**
   * 获取账号列表
   */
  @Get()
  async getList() {
    // 参数将再此获取，并调用具体逻辑处理代码，然后处理返回
    return this.userService.getList();
  }
}

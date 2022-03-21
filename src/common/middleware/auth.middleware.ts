// 中间件职责：读取请求头Authorization，如果存在且有效的话，设置user对象到request中
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { RoleService } from "../../logical/admin/service/role.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware<Request | any, Response> {
  constructor(private readonly roleService: RoleService) {
    this.use = this.use.bind(this);
  }
  async use(req: Request | any, res: Response, next: any) {
    req.user = null;
    const token = req.header("Authorization");
    if (!token) {
      throw new UnauthorizedException("无法获取登录凭证，请重新登录");
    }
    let user = null;
    try {
      user = await this.roleService.getUserByToken(token);
    } catch (e) {
      throw new UnauthorizedException("登录凭证解析失败，请重试");
    }
    // 若无用户信息
    if (!user) {
      throw new UnauthorizedException("查无用户信息，请重试");
    }

    // 获取 redis 里缓存的 token
    const cache = await this.roleService.getRedisValue(user);

    if (token !== cache) {
      // 如果 token 不匹配，禁止访问
      throw new UnauthorizedException("您的登录凭证已失效，请重新登录");
    }

    user.roles = user.auth_key.split(",");
    req.user = user;
    next();
  }
}

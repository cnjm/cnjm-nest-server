import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    //
  }
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler()); // 从控制器注解中得到的角色组信息。
    if (!roles) {
      //没有指定权限直接放行
      return true;
    }
    const request = context.switchToHttp().getRequest();
    // const token = context.switchToRpc().getData().headers.accessToken;
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException("账户信息有误，请重新登录");
    }
    const hasRole = () => user.roles.some((role) => roles.includes(role)); // 是否匹配到角色
    if (!hasRole) {
      throw new ForbiddenException("权限不足，请联系管理员");
    }
    return true;
  }
}

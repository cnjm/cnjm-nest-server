// JWT 的验证策略
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("jwt.secret"),
    });
  }
  async validate(payload: any) {
    // JWT验证 - Step 4: 被守卫调用
    return {
      account: payload.account,
      id: payload.id,
      name: payload.name,
      auth_key: payload.auth_key,
    };
  }
}

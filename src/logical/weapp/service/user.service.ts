import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "/@/entities/User.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { RedisCacheService } from "/@/common/redis/redisCache.service";
@Injectable()
export class UserService {
  appid: string;
  appSecret: string;
  grant_type = "authorizationCode";
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly redisCacheService: RedisCacheService,
  ) {
    this.appid = configService.get<string>("weapp.appid");
    this.appSecret = configService.get<string>("weapp.appSecret");
  }

  // 校验用户信息
  async validateUser(openid: string, session_key: string): Promise<any> {
    const user = await this.findOneByOpenId(openid);
    // 已经存在该 openID的用户 重新生成一个token替换就好了
    if (user) {
      return this.certificate(user);
    }
    // 没有则进行注册，再给token
    //新增用户
    const entity = this.userRepository.create({
      openid,
      session_key,
    });
    try {
      const data = await this.userRepository.save(entity);
      return this.certificate(data);
    } catch (error) {
      throw new InternalServerErrorException("用户创建失败");
    }
  }

  // 准备颁发token
  async certificate(user: User) {
    // 即将生成token的payload
    const payload = { id: user.id };
    try {
      const token = this.jwtService.sign(payload);
      const key = `weapp:${user.id}`;
      // 更新写入Redis
      this.redisCacheService.set(key, token, 168 * 60 * 55);
      return { token };
    } catch (error) {
      throw new InternalServerErrorException("签证失败");
    }
  }

  /**
   * 查询该openid用户
   * @param params 字段
   */
  async findOneByOpenId(openid: string): Promise<any | undefined> {
    let qb = this.userRepository.createQueryBuilder("user");
    qb = qb.where("user.openid = :openid", { openid });
    const data = await qb.getOne();
    return data;
  }

  // 验证token并返回user信息
  async getUserByToken(token: any) {
    const user = await this.jwtService.verify(token);
    return user;
  }

  // 获取Redis key
  async getRedisValue(user: any) {
    const key = `weapp:${user.id}`;
    const redisValue = await this.redisCacheService.get(key);
    return redisValue;
  }

  // 小程序登录
  async login(code: string) {
    try {
      // 用code跟微信请求登录，获取openID
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${this.appid}&secret=${this.appSecret}&js_code=${code}&grant_type=${this.grant_type}`;
      const requestObs = this.httpService.get(url);
      const { data } = await lastValueFrom(requestObs);
      console.log(data);
      // 验证openid
      const authResult = await this.validateUser(data.openid, data.session_key);

      return authResult;
    } catch (error) {
      throw new InternalServerErrorException("微信登录失败，请重新打开小程序");
    }
  }

  /**
   * 获取用户信息
   * @param query 字段
   */
  async getUserInfo(user: any) {
    try {
      const { id } = user;
      const data = await this.userRepository.findOne({ id });
      console.log(id, data);
      delete data.openid;
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.response || "获取失败");
    }
  }

  /**
   * 绑定用户信息  用户授权头像等之后绑定
   * @param params 字段
   */
  async bindUserInfo(params: any, user: any) {
    try {
      delete params.language;
      const { id } = user;
      await this.userRepository.update(id, params);
      return await this.userRepository.findOne(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.response || "添加失败");
    }
  }
}

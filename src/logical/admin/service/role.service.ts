// auth.service.ts 的验证逻辑
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { encryptPassword } from "../auth/cryptogram";
import { AdministratorsService } from "./administrators.service";
import { RedisCacheService } from "/@/common/redis/redisCache.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "../../../entities/Role.entity";
import { AddAuthDto, DelAuthDto, GetAuthListDto } from "../dto/role.dto";
import { format } from "/@/utils/moment";

@Injectable()
export class RoleService {
  constructor(
    private readonly administratorsService: AdministratorsService,
    private readonly jwtService: JwtService,
    private readonly redisCacheService: RedisCacheService,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {
    //
  }

  // JWT验证 - Step 2: 校验用户信息
  async validateUser(account: string, password: string): Promise<any> {
    const admin = await this.administratorsService.findOneByAccount(account);
    if (admin) {
      if (admin.status !== "1") {
        //已经停用了
        return {
          code: 3,
          admin,
        };
      }
      const hashedPassword = admin.password;
      // 通过密码盐，加密传参，再与数据库里的比较，判断是否相等
      const salt = admin.salt;
      const hashPassword = encryptPassword(password, salt);
      if (hashedPassword === hashPassword) {
        // 密码正确
        return {
          code: 1,
          admin,
        };
      } else {
        // 密码错误
        return { code: 2 };
      }
    }
    // 查无此人
    return { code: 4 };
  }

  // JWT验证 - Step 3: 处理 jwt 签证
  async certificate(authResult: any) {
    if (authResult.code === 2) {
      throw new BadRequestException("密码错误");
    }
    if (authResult.code === 3) {
      throw new ForbiddenException("账号已停用，请联系管理员");
    }
    if (authResult.code === 4) {
      throw new BadRequestException("查无此账号");
    }
    const admin = authResult.admin;
    const payload = {
      account: admin.account,
      id: admin.id,
      name: admin.name,
      auth_key: admin.auth_key,
    };
    try {
      const token = this.jwtService.sign(payload);
      const key = `admin:${admin.id}`;
      // 更新写入Redis
      this.redisCacheService.set(key, token, 168 * 60 * 55);
      return { token, userId: admin.id };
      // return { Authorization: token, userId: admin.id };
    } catch (error) {
      throw new InternalServerErrorException("签证失败");
    }
  }

  // 验证token并返回user信息
  async getUserByToken(token: any) {
    const user = await this.jwtService.verify(token);
    return user;
  }

  // 获取Redis key
  async getRedisValue(admin: any) {
    const key = `admin:${admin.id}`;
    const redisValue = await this.redisCacheService.get(key);
    return redisValue;
  }

  // 删除
  async delRedisValue(admin: any) {
    const key = `admin:${admin.id}`;
    await this.redisCacheService.del(key);
    return "ok";
  }

  /**
   * 获取全部权限列表
   */
  async getAuth(): Promise<any> {
    const result = await this.roleRepository.find();
    return result;
  }

  /**
   * 获取权限列表
   */
  async getAuthList(query: GetAuthListDto): Promise<any> {
    const { pageSize = 20, page = 1, name = "", key = "" } = query;
    let qb = this.roleRepository.createQueryBuilder("auth");
    qb = qb
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .where("auth.name like :name", { name: "%" + name + "%" })
      .andWhere("auth.key like :key", { key: "%" + key + "%" });

    const data = await qb.getManyAndCount();
    const items = data[0].map((item) => {
      item.create_at = format(item.create_at, "YYYY-MM-DD HH:mm:ss");
      return item;
    });
    const result = { items, total: data[1] };
    return result;
  }

  /**
   * 添加权限
   * @param params 信息
   */
  async addAuth(params: AddAuthDto): Promise<string> {
    const data = await this.roleRepository.findOne({ key: params.key });
    if (data) {
      throw new ConflictException("key已存在");
    }
    //新增用户
    const entity = this.roleRepository.create(params);
    const result = await this.roleRepository.save(entity);
    if (result) {
      return "权限创建成功";
    }
  }

  /**
   * 删除权限
   */
  async delAuth(params: DelAuthDto): Promise<string> {
    const id = params.id;
    const data = await this.roleRepository.delete({ id });
    if (data.affected === 0) {
      throw new BadRequestException("id有误");
    }
    return "权限删除成功";
  }
}

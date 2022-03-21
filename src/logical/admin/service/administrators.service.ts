import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "../../../entities/Admin.entity";
import { Role } from "../../../entities/Role.entity";
import { getConnection, Repository } from "typeorm";
import { encryptPassword, makeSalt } from "../auth/cryptogram";
import { RedisCacheService } from "/@/common/redis/redisCache.service";
import { format } from "/@/utils/moment";
import {
  AddAccountDto,
  EditAccountByOwnDto,
  EditAccountDto,
  GetAccountListDto,
} from "../dto/administrators.dto";

@Injectable()
export class AdministratorsService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private redisCacheService: RedisCacheService,
  ) {
    //
  }

  /**
   * 查询是否某一条件  user
   * @param params 字段
   */
  async findOne(params: any): Promise<any | undefined> {
    const data = await this.adminRepository.findOne(params);
    return data;
  }

  /**
   * 查询该Account用户，并增加密码盐,密码的返回
   * @param params 字段
   */
  async findOneByAccount(account: string): Promise<any | undefined> {
    let qb = this.adminRepository.createQueryBuilder("admin");
    qb = qb
      .where("admin.account = :account", { account })
      .addSelect(["admin.salt", "admin.password"]);
    const data = await qb.getOne();
    return data;
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(user: any): Promise<any> {
    const result = await this.findOne({ id: user.id });
    if (!result) {
      throw new BadRequestException("查无此账号");
    }
    // const qb = this.roleRepository.createQueryBuilder("auth");
    const auth_key = result.auth_key.split(",");
    const auth_keys = await this.roleRepository.find();
    const temp_auth_keys = auth_keys.map((item) => {
      return { roleName: item.name, value: item.key };
    });
    result.roles = temp_auth_keys.filter((item) => {
      return auth_key.includes(item.value);
    });
    // result.roles = result.auth_key.split(",");
    result.userId = result.id;
    result.realName = result.name;
    result.username = result.account;
    delete result.id;
    delete result.auth_key;
    delete result.name;
    return result;
  }

  /**
   * 获取账号列表
   */
  async getAccountList(query: GetAccountListDto): Promise<any> {
    const {
      pageSize = 20,
      page = 1,
      name = "",
      account = "",
      status = "",
    } = query;
    try {
      let qb = this.adminRepository.createQueryBuilder("admin");
      qb = qb
        .skip(pageSize * (page - 1))
        .take(pageSize)
        .where("admin.name like :name", { name: "%" + name + "%" })
        .andWhere("admin.account like :account", {
          account: "%" + account + "%",
        })
        .andWhere("admin.status like :status", {
          status: "%" + status + "%",
        });

      const data = await qb.getManyAndCount();
      const items = data[0].map((item) => {
        item.create_at = format(item.create_at, "YYYY-MM-DD HH:mm:ss");
        return item;
      });
      const result = { items, total: data[1] };
      return result;
    } catch (error) {
      throw new InternalServerErrorException("查询失败");
    }
  }

  /**
   * 添加账户
   * @param params 新建账户的信息
   */
  async addAccount(params: AddAccountDto): Promise<string> {
    const account = await this.findOne({ account: params.account });
    if (account) {
      throw new ConflictException("账号已存在");
    }
    //允许添加账户
    const salt = makeSalt(); // 制作密码盐
    const hashPwd = encryptPassword(params.password, salt); // 加密密码

    //新增用户
    const entity = this.adminRepository.create(params);

    entity.password = hashPwd;
    entity.salt = salt;
    const result = await this.adminRepository.save(entity);
    if (result) {
      return "账号创建成功";
    }
  }

  /**
   * 编辑账户
   * @param data 编辑账户的信息
   */
  async editAccount(params: EditAccountDto): Promise<any> {
    let qb = this.adminRepository.createQueryBuilder("admin");
    qb = qb.where("admin.id = :id", { id: params.id }).addSelect("admin.salt");
    const data = await qb.getOne();
    if (!data) {
      throw new BadRequestException("查无此账号");
    }
    const hashedPassword = params.password;
    const status = params.status;
    // 通过密码盐，加密再入库
    if (hashedPassword) {
      //如果上传了密码就重新生成新密码入库
      const salt = data.salt;
      const hashPassword = encryptPassword(hashedPassword, salt);
      params.password = hashPassword;
    }
    // 修改密码或状态修改为非启用则清空缓存
    if (hashedPassword || status !== "1") {
      const key = `admin:${data.id}`;
      await this.redisCacheService.del(key);
    }
    delete params.id;
    await this.adminRepository.update(data.id, params);
    return "ok";
  }

  /**
   * 编辑个人账号
   */
  async editAccountByOwn(
    user: EditAccountByOwnDto,
    redis_user: any,
  ): Promise<any> {
    const data = await this.findOneByAccount(redis_user.account);
    if (!data) {
      throw new BadRequestException("查无此账号");
    }
    const hashedPassword = user.password;
    // 通过密码盐，加密再入库
    if (hashedPassword) {
      //如果上传了密码就重新生成新密码入库
      const salt = data.salt;
      const hashPassword = encryptPassword(hashedPassword, salt);
      const key = `admin:${data.id}`;
      await this.redisCacheService.del(key);
      user.password = hashPassword;
    }
    // 整理过来的数据，有些是不给改的
    const {
      password = data.password,
      email = data.email,
      phone = data.phone,
    } = user;
    const result = await getConnection()
      .createQueryBuilder()
      .update(Admin)
      .set({ password, email, phone })
      .where("id = :id", { id: data.id })
      .execute();
    if (result.affected <= 0) {
      throw new BadRequestException("请求信息有误");
    }
    return "修改成功";
  }

  /**
   * 删除账号
   */
  async delAccount(params: any): Promise<any> {
    const id = params.id;
    try {
      const data = await this.adminRepository.delete({ id });
      if (data.affected === 0) {
        throw new BadRequestException("id有误");
      }
      // 删除账号清空缓存
      const key = `admin:${id}`;
      await this.redisCacheService.del(key);
    } catch (error) {
      throw new InternalServerErrorException("服务器操作失败");
    }

    return "账号删除成功";
  }

  /**
   * 禁用/开启账号
   */
  async modifyAccount(params: any): Promise<any> {
    const { id, status } = params;
    const result = await getConnection()
      .createQueryBuilder()
      .update(Admin)
      .set({ status })
      .where("id = :id", { id })
      .execute();
    if (result.affected > 0) {
      return "修改成功";
    }
    if (!result) {
      throw new BadRequestException("id有误");
    }
  }

  /**
   * 退出登录
   */
  async logout(admin: any): Promise<any> {
    const key = `admin:${admin.id}`;
    await this.redisCacheService.del(key);
    return "ok";
  }
}

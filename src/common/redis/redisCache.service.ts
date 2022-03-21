import { Injectable } from "@nestjs/common";
import { RedisService } from "@chenjm/nestjs-redis";
import { Redis } from "ioredis";
@Injectable()
export class RedisCacheService {
  private client: Redis;
  constructor(private redisService: RedisService) {
    this.getClient();
  }

  private async getClient() {
    this.client = await this.redisService.getClient("default"); // 连接clinet 默认default
  }

  /**
   * @Description: 封装设置redis缓存的方法
   * @param key {String} key值
   * @param value {String} key的值
   * @param seconds {Number} 过期时间
   * @return: Promise<any>
   */
  public async set(key: string, value: any, seconds?: number): Promise<any> {
    if (!seconds) {
      await this.client.set(key, value);
    } else {
      await this.client.set(key, value, "EX", seconds);
    }
  }

  /**
   * @Description: 设置获取redis缓存中的值
   * @param key {String}
   */
  public async get(key: string): Promise<any> {
    const data = await this.client.get(key);
    if (data) return data;
    return null;
  }

  /**
   * @Description: 根据key删除redis缓存数据
   * @param key {String}
   * @return:
   */
  public async del(key: string): Promise<any> {
    return await this.client.del(key);
  }

  /**
   * @Description: 清空redis的缓存
   * @param {type}
   * @return:
   */
  public async flushall(): Promise<any> {
    return await this.client.flushall();
  }
}

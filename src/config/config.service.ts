import { Injectable } from '@nestjs/common';

import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';

export interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    // 读取文件变量挂到envConfig
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      SERVER_PORT: Joi.number().default(3000),
      BS_URL: Joi.string(),
      DB_HOST: Joi.string(),
      DB_TYPE: Joi.string(),
      DB_PORT: Joi.number(),
      DB_USER: Joi.string(),
      DB_PWD: Joi.string(),
      DB_DB: Joi.string(),
      DB_SYN: Joi.boolean(),
      RD_PORT: Joi.number().default(6379),
      RD_HOST: Joi.string().default('127.0.0.1'),
      RD_DB: Joi.number().default(0),
      RD_PWD: Joi.string(),
    });
    const { error, value: validatedEnvConfig } =
      envVarsSchema.validate(envConfig);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
  get port(): number {
    return Number(this.envConfig.SERVER_PORT);
  }
  get bsUrl(): string {
    return this.envConfig.BS_URL;
  }
  // mysql相关
  get dbType(): string {
    return this.envConfig.DB_TYPE;
  }
  get dbHost(): string {
    return this.envConfig.DB_HOST;
  }
  get dbPort(): number {
    return Number(this.envConfig.DB_PORT);
  }
  get dbUser(): string {
    return this.envConfig.DB_USER;
  }
  get dbPwd(): string {
    return this.envConfig.DB_PWD;
  }
  get dbDb(): string {
    return this.envConfig.DB_DB;
  }
  get dbSyn(): boolean {
    return Boolean(this.envConfig.DB_SYN);
  }
  // Redis相关
  get rdPort(): number {
    return Number(this.envConfig.RD_PORT);
  }
  get rdHost(): string {
    return String(this.envConfig.RD_HOST);
  }
  get rdDb(): number {
    return Number(this.envConfig.RD_DB);
  }
  get rdPwd(): string {
    return String(this.envConfig.RD_PWD);
  }
}

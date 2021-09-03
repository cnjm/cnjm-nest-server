import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`${process.env.NODE_ENV}.env`), // 读取当前环境的env文件
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}

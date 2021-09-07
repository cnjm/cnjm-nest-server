import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局基础URL，届时所有路由前都会有这个基础的url
  app.setGlobalPrefix(AppModule.bsUrl);

  // 全局注册错误的过滤器
  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(AppModule.port, () => {
    console.log(`http://localhost:${AppModule.port}/${AppModule.bsUrl}`);
  });
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ModifyInterceptor } from './common/filters/modify.interceptor';
// import { LoggerMiddleware } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局基础URL，届时所有路由前都会有这个基础的url
  app.setGlobalPrefix(AppModule.bsUrl);

  // 全局拦截器
  app.useGlobalInterceptors(new ModifyInterceptor());

  // 全局注册错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局日志中间件
  // app.use(new LoggerMiddleware().use);

  await app.listen(AppModule.port, () => {
    console.log(`http://localhost:${AppModule.port}/${AppModule.bsUrl}`);
  });
}
bootstrap();

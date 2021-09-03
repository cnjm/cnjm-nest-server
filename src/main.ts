import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局基础URL，届时所有路由前都会有这个基础的url  这不是必须的，看是否需要
  app.setGlobalPrefix(AppModule.bsUrl);
  await app.listen(AppModule.port, () => {
    console.log(`http://localhost:${AppModule.port}/${AppModule.bsUrl}`);
  });
}
bootstrap();

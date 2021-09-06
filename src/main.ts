import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(AppModule.bsUrl); // 全局基础URL，届时所有路由前都会有这个基础的url
  await app.listen(AppModule.port, () => {
    console.log(`http://localhost:${AppModule.port}/${AppModule.bsUrl}`);
  });
}
bootstrap();

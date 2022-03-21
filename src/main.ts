import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ModifyInterceptor } from "./common/filters/modify.interceptor";
import { VerificationPipe } from "./common/pipe/verification.pipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const http = configService.get("http");

  // 允许跨域
  app.enableCors();

  // 全局基础URL
  app.setGlobalPrefix(http.bsUrl);

  // 全局拦截器
  app.useGlobalInterceptors(new ModifyInterceptor());

  // 全局注册错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局日志中间件
  // app.use(new LoggerMiddleware().use);

  // 全局使用管道
  app.useGlobalPipes(new VerificationPipe());

  // swagger文档集成
  const options = new DocumentBuilder()
    .setTitle("Online Mall example")
    .setDescription("The Online Mall API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api/doc", app, document);

  await app.listen(http.port, () => {
    console.log(`http://localhost:${http.port}/${http.bsUrl}`);
  });
}
bootstrap();

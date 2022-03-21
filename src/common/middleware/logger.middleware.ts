import { Injectable, NestMiddleware } from "@nestjs/common";
import { Logger } from "../log4js/index";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // 拼接需要写入的内容
    const logFormat = `{method: ${req.method}, requestOriginalUrl: ${
      req.originalUrl
    }, query:${JSON.stringify(req.query)}, params:${JSON.stringify(
      req.params,
    )}, ip: ${req.ip}, statusCode: ${res.statusCode} }`;
    next();
    Logger.access(JSON.stringify(logFormat));
    //这里就记录所有请求的参数而已，当然，也可以在这里判断 res.statusCode 写入不同类型的日志，看项目需要，只是展示可以这么做
    //如果你希望对不同的路由有不同的处理，可以另写一个，绑定到特定的路由。
  }
}

import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from "@nestjs/common";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
interface Response<T> {
  result: T;
  code: number;
  message: string;
}
@Injectable()
export class ModifyInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((result) => {
        return {
          result,
          code: 20000,
          message: "响应成功",
        };
      }),
    );
  }
}

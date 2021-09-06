import { Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Injectable()
export class AppService {
  constructor(public readonly config: ConfigService) {}
  getHello(): string {
    return 'Hello World!' + this.config.port;
  }
}

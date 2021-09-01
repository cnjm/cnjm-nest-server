import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './logical/auth/auth.service';
import { AuthController } from './logical/auth/auth.controller';
import { UserModule } from './logical/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}

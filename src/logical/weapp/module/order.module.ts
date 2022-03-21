import { BullModule } from "@nestjs/bull";
import { Module, SetMetadata } from "@nestjs/common";
import { MODULE_PATH } from "@nestjs/common/constants";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WeappOrderController } from "../controller/order.controller";
import { WeappOrderService } from "../service/order.service";
import { Order } from "/@/entities/Order.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    BullModule.registerQueueAsync({
      inject: [ConfigService],
      name: "task",
      useFactory: (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get("redis.host"),
            port: configService.get("redis.port"),
          },
        };
      },
    }),
  ],
  controllers: [WeappOrderController],
  providers: [WeappOrderService],
  exports: [WeappOrderService],
})
@SetMetadata(MODULE_PATH, "/weapp")
export class WeappOrderModule {
  //
}

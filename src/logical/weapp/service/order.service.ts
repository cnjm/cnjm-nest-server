import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Job, Queue } from "bull";
import { Repository } from "typeorm";
import {
  AddOrderDto,
  GetOrderByIdDto,
  GetOrderByStatusDto,
  PayOrderDto,
} from "../dto/order.dto";
import { Order } from "/@/entities/Order.entity";
import { OrderEnum } from "/@/enum/order.enum";
import { RangeEnum } from "/@/enum/range.enum";
@Injectable()
@Processor("task")
export class WeappOrderService {
  constructor(
    @InjectQueue("task") private readonly taskQueue: Queue,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {
    //
  }

  /**
   * 任务队列消费者，处理订单过期
   * @param params 字段
   */
  @Process("checkOrder")
  async processTask(job: Job<any>) {
    const { id } = job.data;
    const order = await this.orderRepository.findOne({ id });
    // 如果订单还是待支付状态 则直接取消订单
    if (order.status === OrderEnum.PAID) {
      await this.orderRepository.update(id, { status: OrderEnum.CANCEL });
      console.log(`订单${id}已被取消`);
    }
  }

  /**
   * 添加订单
   * @param params 字段
   */
  async addOrder(params: AddOrderDto, user: any) {
    try {
      console.log(params, user);
      // 在此前创建订单
      // 创建订单之后，超时取消订单
      await this.taskQueue.add(
        "checkOrder",
        { id: "1" }, // 生成的订单id 这里写死
        { delay: RangeEnum.ORDER_OVER_TIME },
      );
      return "接口示例";
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("添加失败");
    }
  }

  /**
   * 用户支付订单/或其他行为改变订单状态
   * @param params 字段
   */
  async payOrder(param: PayOrderDto, user: any) {
    try {
      const { id } = param;
      console.log(param, user);
      // TODO
      console.log(id);
      return "示例接口";
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.response || "操作失败");
    }
  }
}

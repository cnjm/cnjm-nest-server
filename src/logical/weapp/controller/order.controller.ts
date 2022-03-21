import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "../../admin/auth/roles.guard";
import {
  AddOrderDto,
  GetOrderByIdDto,
  GetOrderByStatusDto,
  PayOrderDto,
} from "../dto/order.dto";
import { WeappOrderService } from "../service/order.service";

@ApiTags("weapp-order")
@Controller("order")
@UseGuards(RolesGuard)
export class WeappOrderController {
  constructor(private readonly orderService: WeappOrderService) {
    //
  }

  // 获取订单 根据id
  @Get("getOrderById")
  @ApiOperation({ summary: "获取订单 根据id" })
  async getOrderById(@Query() query: GetOrderByIdDto): Promise<any> {
    return query;
  }

  // 获取订单 根据status
  @Get("getOrderByStatus")
  @ApiOperation({ summary: "获取订单 根据status" })
  async getOrderByStatus(@Query() query: GetOrderByStatusDto): Promise<any> {
    return query;
  }

  @Post("addOrder")
  @ApiOperation({ summary: "添加订单" })
  async addOrder(
    @Body() params: AddOrderDto,
    @Request() request,
  ): Promise<any> {
    return this.orderService.addOrder(params, request.user);
  }

  @Post("payOrder")
  @ApiOperation({ summary: "支付订单 -- 付款接口" })
  async payOrder(
    @Body() params: PayOrderDto,
    @Request() request,
  ): Promise<any> {
    return this.orderService.payOrder(params, request.user);
  }

  @Post("receivedGoods")
  @ApiOperation({ summary: "确认收货" })
  async receivedGoods(
    @Body() params: PayOrderDto,
    @Request() request,
  ): Promise<any> {
    return { params, request };
  }
}

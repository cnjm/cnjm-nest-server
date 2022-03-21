import { IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { QueryDto } from "/@/common/dto/query.dto";

export class GetOrderByIdDto {
  @ApiProperty({ description: "订单id" })
  readonly id: number;
}

export class GetOrderByStatusDto extends QueryDto {
  @ApiProperty({ description: "订单状态" })
  readonly status: string;
}

export class AddOrderDto {
  user_id: string;

  @ApiProperty({ description: "合计金额" })
  readonly total_price: number;

  @ApiProperty({ description: "收货地址" })
  readonly address: string;

  @ApiProperty({ description: "收货号码" })
  readonly phone: string;

  @ApiProperty({ description: "购物车" })
  carts: Array<any>;

  @IsOptional()
  @ApiPropertyOptional({ description: "状态" })
  readonly status: string;
}

export class PayOrderDto {
  @ApiProperty({ description: "订单id" })
  readonly id: number;
}

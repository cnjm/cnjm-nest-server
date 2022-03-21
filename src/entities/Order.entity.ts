import { Entity, Column } from "typeorm";
import { BaseEntity } from "./Base.entity";
// 订单信息
@Entity()
export class Order extends BaseEntity {
  @Column({ comment: "用户id" })
  user_id: string;

  @Column({ comment: "合计金额" })
  total_price: number;

  @Column({ comment: "收货地址" })
  address: string;

  @Column({ comment: "收货人姓名" })
  name: string;

  @Column({ comment: "收货号码" })
  phone: string;

  @Column({ default: "", comment: "快递单号" })
  express_no: string;

  @Column({
    default: "1",
    length: 2,
    comment: "状态 1 待支付 2 待发货 3 待收货 4 已完成 5 已取消",
  })
  status: string;
}

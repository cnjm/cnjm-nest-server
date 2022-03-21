import { Entity, Column } from "typeorm";
import { BaseEntity } from "./Base.entity";

@Entity()
export class Admin extends BaseEntity {
  @Column({
    length: 20,
    comment: "真实姓名",
  })
  name: string;

  @Column({
    length: 50,
    comment: "账号",
  })
  account: string;

  @Column({
    length: 50,
    select: false,
    comment: "密码",
  })
  password: string;

  @Column({ default: "", length: 50, comment: "邮箱" })
  email: string;

  @Column({ default: "", length: 11, comment: "手机号" })
  phone: string;

  @Column({
    length: 8,
    select: false,
    comment: "密码盐",
  })
  salt: string;

  @Column({ default: "1", length: 2, comment: "账户状态 1 生效 非1 注销" })
  status: string;

  @Column({ default: "", comment: "备注" })
  des: string;

  @Column({ default: "", comment: "角色" })
  roles: string;
}

import { Entity, Column } from "typeorm";
import { BaseEntity } from "./Base.entity";

@Entity()
export class Role extends BaseEntity {
  @Column({
    length: 50,
    comment: "角色名称",
  })
  name: string;

  @Column({
    length: 50,
    comment: "角色key",
  })
  key: string;

  @Column({ default: "", comment: "备注" })
  des: string;
}

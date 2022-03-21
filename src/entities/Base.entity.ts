import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn({
    type: "datetime",
    comment: "创建时间",
  })
  create_at: Date;

  @UpdateDateColumn({
    type: "datetime",
    comment: "更新时间",
  })
  update_at: Date;
}

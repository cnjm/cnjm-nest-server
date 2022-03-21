import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, default: "", comment: "用户昵称" })
  nickName: string;

  @Column({ length: 100, default: "", comment: "openid" })
  openid: string;

  @Column({ select: false, length: 100, default: "", comment: "session_key" })
  session_key: string;

  @Column({ length: 255, default: "", comment: "头像" })
  avatarUrl: string;

  @Column({ default: 0, comment: "性别 0 未知 1男 2女" })
  gender: number;

  @Column({ length: 50, default: "", comment: "省份" })
  province: string;

  @Column({ length: 50, default: "", comment: "城市" })
  city: string;

  @Column({ length: 50, default: "", comment: "城镇" })
  country: string;

  @CreateDateColumn({
    type: "timestamp",
    comment: "创建时间",
  })
  create_at: number;

  @UpdateDateColumn({
    type: "timestamp",
    comment: "更新时间",
  })
  update_at: number;
}

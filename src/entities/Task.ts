import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("text")
  name: string;

  @CreateDateColumn()
  createdAt: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  creator: User;
}

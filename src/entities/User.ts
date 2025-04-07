import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("text", { unique: true })
  username: string;

  @Column("text")
  password: string;

  @Column("enum", { default: UserRole.USER, enum: UserRole })
  role: UserRole;
}

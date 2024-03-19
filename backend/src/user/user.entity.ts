/* user.entity.ts */
/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntitiy {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  tz: number;

  @Column()
  password: string;

  @Column()
  createdAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ElectionOption, User } from '@libs/core/database/entities';

@Entity()
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  public readonly id: number;

  @ManyToOne(() => User, (user) => user.votes)
  public user: User;

  @ManyToMany(() => ElectionOption, { cascade: true })
  @JoinTable()
  options: ElectionOption[];

  @CreateDateColumn()
  @ApiProperty()
  public createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  public updatedAt: Date;
}

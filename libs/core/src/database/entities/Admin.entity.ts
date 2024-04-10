import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseStudent } from '@libs/core/database/entities';

@Entity()
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  public readonly id: number;

  @OneToOne(() => BaseStudent)
  @JoinColumn()
  student: BaseStudent;

  @Column({ nullable: true })
  @ApiProperty()
  public name: string;
}

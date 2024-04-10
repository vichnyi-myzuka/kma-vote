import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseStudent, User, Election } from '@libs/core/database/entities';

@Entity()
export class ElectionOption extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  public readonly id: number;

  @ManyToOne(() => BaseStudent, (student) => student.electionOptions)
  student: BaseStudent;

  @Column({ nullable: true, default: () => 'NULL' })
  @ApiProperty()
  public description?: string;

  @ManyToOne(() => Election, (election) => election.options, {
    onDelete: 'CASCADE',
  })
  election: Election;

  @CreateDateColumn()
  @ApiProperty()
  public createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  public updatedAt: Date;

  @ManyToOne(() => User, (user) => user.createdElectionOptions)
  public createdBy: User;

  @ManyToOne(() => User, (user) => user.createdElectionOptions)
  public updatedBy: User;
}

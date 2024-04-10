import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseStudent,
  Election,
  ElectionOption,
} from '@libs/core/database/entities';

@Entity()
export class ElectionResult extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  public readonly id: number;

  @ManyToOne(() => Election, (election) => election.results, {
    onDelete: 'CASCADE',
  })
  public election: Election;

  @OneToOne(() => ElectionOption, { onDelete: 'CASCADE' })
  @JoinColumn()
  public option: ElectionOption;

  @Column('jsonb', { nullable: true })
  @ApiProperty()
  public student: BaseStudent;

  @Column()
  @ApiProperty()
  public votes: number;

  @CreateDateColumn()
  @ApiProperty()
  public createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  public updatedAt: Date;
}

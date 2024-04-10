import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ElectionOption, Election, Vote } from '@libs/core/database/entities';
import { Role } from '@libs/core/database/enums';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  public readonly id: number;

  @Column({
    unique: true,
  })
  @ApiProperty()
  public sourceId: string;

  @Column({
    unique: true,
    nullable: true,
    default: () => 'NULL',
  })
  @ApiProperty()
  public email: string;

  @Column({
    nullable: true,
    default: () => 'NULL',
  })
  @ApiProperty()
  public username?: string;

  @Column('text', {
    nullable: false,
    array: true,
  })
  @ApiProperty()
  public roles: Role[];

  @CreateDateColumn()
  @ApiProperty()
  public createdAt: Date;

  @OneToMany(() => ElectionOption, (option) => option.createdBy)
  createdElectionOptions: ElectionOption[];

  @OneToMany(() => ElectionOption, (option) => option.updatedBy)
  updatedElectionOptions: ElectionOption[];

  @OneToMany(() => Election, (election) => election.createdBy)
  createdElections: Election[];

  @OneToMany(() => Election, (election) => election.updatedBy)
  updatedElections: Election[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
}

import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ElectionOption,
  ElectionResult,
  User,
} from '@libs/core/database/entities';
import { ElectionStatus } from '@libs/core/database/enums';
import { ScenarioFilter } from '@libs/core/database/types';

@Entity()
export class Election extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  public readonly id: number;

  @Column({
    unique: true,
  })
  @ApiProperty()
  public name: string;

  @Column({ nullable: true, default: () => 'NULL' })
  @ApiProperty()
  public description?: string;

  @Column({
    unique: true,
  })
  @ApiProperty()
  public urlKey: string;

  @Column()
  @ApiProperty()
  public minSelectedOptions: number;

  @Column()
  @ApiProperty()
  public maxSelectedOptions: number;

  @Column('jsonb', { nullable: false, default: {} })
  @ApiProperty()
  public accessScenarioParams: ScenarioFilter;

  @Column('boolean', { nullable: false, default: false })
  @ApiProperty()
  public hide: boolean;

  @Column('timestamp', { nullable: true })
  @ApiProperty()
  public startDate: Date;

  @Column('timestamp', { nullable: false })
  @ApiProperty()
  public endDate: Date;

  @Column({ nullable: false })
  @ApiProperty()
  public status: ElectionStatus;

  @OneToMany(() => ElectionOption, (option) => option.election, {
    cascade: true,
  })
  public options: ElectionOption[];

  @CreateDateColumn()
  @ApiProperty()
  public createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  public updatedAt: Date;

  @ManyToOne(() => User, (user) => user.createdElections)
  public createdBy: User;

  @ManyToOne(() => User, (user) => user.updatedElections)
  public updatedBy: User;

  @ManyToOne(() => ElectionResult, (result) => result.election)
  public results?: ElectionResult[];
}

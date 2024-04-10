import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseEntity, Column, Entity } from 'typeorm';
import { ElectionOption } from '@libs/core/database/entities';

@Entity('students')
export class BaseStudent extends BaseEntity {
  @PrimaryColumn()
  @ApiProperty()
  public cdoc: number;

  @Column({ nullable: true })
  @ApiProperty()
  public name: string;

  @Column({ nullable: true })
  @ApiProperty()
  public year: string;

  @Column({ nullable: true })
  @ApiProperty()
  public level: string;

  @Column({ nullable: true })
  @ApiProperty()
  public spec: string;

  @Column({ nullable: true })
  @ApiProperty()
  public facultyname: string;

  @Column({ nullable: true })
  @ApiProperty()
  public ukma_email: string;

  @Column()
  @ApiProperty()
  public status: number;

  @CreateDateColumn()
  @ApiProperty()
  public createdAt: Date;

  @OneToMany(() => ElectionOption, (option) => option.student)
  electionOptions: ElectionOption[];
}

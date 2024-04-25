import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'View_Data_student_service' })
export class SqlServerStudent extends BaseEntity {
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
}

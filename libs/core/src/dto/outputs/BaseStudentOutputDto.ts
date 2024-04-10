import { BaseStudent } from '@libs/core/database/entities';
import { ApiProperty } from '@nestjs/swagger';

export class BaseStudentOutputDto {
  constructor(baseStudent: BaseStudent) {
    this.cdoc = baseStudent.cdoc;
    this.name = baseStudent.name;
    this.year = baseStudent.year;
    this.level = baseStudent.level;
    this.spec = baseStudent.spec;
    this.facultyname = baseStudent.facultyname;
    this.ukma_email = baseStudent.ukma_email;
  }

  @ApiProperty()
  public cdoc: number;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public year: string;

  @ApiProperty()
  public level: string;

  @ApiProperty()
  public spec: string;

  @ApiProperty()
  public facultyname: string;

  @ApiProperty()
  public ukma_email: string;
}

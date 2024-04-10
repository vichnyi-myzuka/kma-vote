import { ApiProperty } from '@nestjs/swagger';

export class ElectionOptionDto {
  @ApiProperty()
  public studentId: number;

  @ApiProperty()
  public description?: string;

  @ApiProperty()
  public id?: number;
}

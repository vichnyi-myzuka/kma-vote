import { ApiProperty } from '@nestjs/swagger';

export class UpdateElectionOptionDto {
  @ApiProperty()
  public studentId?: number;

  @ApiProperty()
  public description?: string;
}

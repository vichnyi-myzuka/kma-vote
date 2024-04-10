import { ElectionOption } from '@libs/core/database/entities';
import { ApiProperty } from '@nestjs/swagger';

export class VoteDataDto {
  @ApiProperty()
  public options?: ElectionOption[];
}

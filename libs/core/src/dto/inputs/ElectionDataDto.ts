import { ApiProperty } from '@nestjs/swagger';
import { ElectionOptionDto, ElectionDto } from '@libs/core/dto';

export class ElectionDataDto {
  @ApiProperty()
  electionDto: ElectionDto;

  @ApiProperty()
  electionOptionDtos: ElectionOptionDto[];
}

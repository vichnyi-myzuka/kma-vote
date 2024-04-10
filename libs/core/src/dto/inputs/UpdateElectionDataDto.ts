import { ApiProperty } from '@nestjs/swagger';
import { UpdateElectionDto, UpdateElectionOptionDto } from '@libs/core/dto';

export class UpdateElectionDataDto {
  @ApiProperty()
  electionDto: UpdateElectionDto;

  @ApiProperty()
  electionOptionDtos: UpdateElectionOptionDto[];
}

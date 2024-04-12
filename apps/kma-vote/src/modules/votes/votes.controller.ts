import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import type { UserRequest } from '@libs/core/auth/types';
import { VoteDataDto } from '@libs/core/dto';
import { Vote } from '@libs/core/database/entities';
import { VotesService } from './votes.service';

@ApiTags('Votes')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Get('/election-progress/:id')
  // @UseGuards(UserGuard)
  // @Roles(Role.Admin)
  public async getElectionProgress(@Param('id') id: number) {
    return this.votesService.getElectionProgress(id);
  }

  @Post('/vote/:id')
  // @UseGuards(UserGuard)
  public async vote(
    @Req() req: UserRequest,
    @Param('id') id: number,
    @Body() voteData: VoteDataDto,
  ): Promise<Vote> {
    return this.votesService.voteForStudents(req, id, voteData.options);
  }
}

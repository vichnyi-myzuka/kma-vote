import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { UserRequest } from '@libs/core/auth/types';
import { VoteDataDto } from '@libs/core/dto';
import { Vote } from '@libs/core/database/entities';
import { VotesService } from './votes.service';
import { UserGuard } from '@libs/core/auth/guards';
import { Roles } from '@libs/core/auth/decorators';
import { Role } from '@libs/core/database/enums';

@ApiTags('Votes')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Get('/election-progress/:id')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async getElectionProgress(@Param('id') id: number) {
    return this.votesService.getElectionProgress(id);
  }

  @Post('/vote/:id')
  @UseGuards(UserGuard)
  public async vote(
    @Req() req: UserRequest,
    @Param('id') id: number,
    @Body() voteData: VoteDataDto,
  ): Promise<Vote> {
    return this.votesService.voteForStudents(req, id, voteData.options);
  }

  @Get('/user-votes/:id')
  @UseGuards(UserGuard)
  public async getUserVotes(@Req() req: UserRequest, @Param('id') id: number) {
    return this.votesService.getUserVotes(req, id);
  }
}

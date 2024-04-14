import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ElectionService } from '@app/kma-vote/modules/election/services';
import { UserGuard } from '@libs/core/auth/guards';
import {
  BaseStudent,
  Election,
  ElectionResult,
} from '@libs/core/database/entities';
import { ElectionDataDto } from '@libs/core/dto';
import { Roles } from '@libs/core/auth/decorators';
import { Role } from '@libs/core/database/enums';
import type { UserRequest } from '@libs/core/auth/types';

@ApiTags('Election')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/election')
export class ElectionController {
  constructor(private readonly electionService: ElectionService) {}

  @Post()
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async create(
    @Body() electionData: ElectionDataDto,
  ): Promise<Election> {
    return this.electionService.create(electionData);
  }

  @Get()
  @UseGuards(UserGuard)
  public async findAll(
    @Req() req: UserRequest,
    @Query() { take, skip, filter },
  ): Promise<{ data: Election[]; total: number }> {
    return this.electionService.findAll(req, take, skip, filter);
  }

  @Get('/available')
  @UseGuards(UserGuard)
  public async findAllAvailable(
    @Req() req: UserRequest,
    @Query() { take, skip },
  ): Promise<{ data: Election[]; total: number }> {
    return this.electionService.findAllAvailableElections(req, { take, skip });
  }

  @Get('/voted')
  @UseGuards(UserGuard)
  public async getVotedElections(
    @Req() req: UserRequest,
    @Query() { take, skip },
  ): Promise<{ data: Election[]; total: number }> {
    return this.electionService.getVotedElections(req, take, skip);
  }

  @Get(':id')
  @UseGuards(UserGuard)
  public async findOne(
    @Req() req: UserRequest,
    @Param('id') id: number,
  ): Promise<Election> {
    return this.electionService.findOne(req, id);
  }

  @Get(':id/students')
  @UseGuards(UserGuard)
  public async findSelectedStudents(
    @Req() req: UserRequest,
    @Param('id') id: number,
  ): Promise<BaseStudent[]> {
    return this.electionService.findSelectedStudents(req, id);
  }

  @Get('/slug/:slug')
  @UseGuards(UserGuard)
  public async findByName(
    @Req() req: UserRequest,
    @Param('slug') slug: string,
  ): Promise<{ election: Election; isVoted: boolean }> {
    return this.electionService.findBySlug(req, slug);
  }

  @Get(':id/results')
  @UseGuards(UserGuard)
  public async getResults(@Param('id') id: number): Promise<ElectionResult[]> {
    return this.electionService.getElectionResults(id);
  }

  @Get(':id/can-vote')
  @UseGuards(UserGuard)
  public async canVote(
    @Req() req: UserRequest,
    @Param('id') id: number,
  ): Promise<boolean> {
    return this.electionService.canVote(req, id);
  }

  @Delete(':id')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async delete(@Param('id') id: number): Promise<Election> {
    return this.electionService.delete(id);
  }

  @Post('/hide/:id')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async hide(@Param('id') id: number): Promise<Election> {
    return this.electionService.hide(id);
  }

  @Post('/show/:id')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async show(@Param('id') id: number): Promise<Election> {
    return this.electionService.show(id);
  }

  @Patch(':id')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async update(
    @Param('id') id: number,
    @Body() electionDataDto: ElectionDataDto,
  ): Promise<Election> {
    return this.electionService.update(id, electionDataDto);
  }

  @Post('/start/:id')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async start(@Param('id') id: number): Promise<Election> {
    return this.electionService.start(id);
  }

  @Post('/complete/:id')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async complete(@Param('id') id: number): Promise<Election> {
    return this.electionService.complete(id);
  }

  @Post('/cancel/:id')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async cancel(@Param('id') id: number): Promise<Election> {
    return this.electionService.cancel(id);
  }

  @Post('/pause/:id')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async pause(@Param('id') id: number): Promise<Election> {
    return this.electionService.pause(id);
  }

  @Post('/resume/:id')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async resume(@Param('id') id: number): Promise<Election> {
    return this.electionService.resume(id);
  }
}

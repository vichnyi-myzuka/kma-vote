import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ElectionOptionService } from '@app/kma-vote/modules/election/services';
import { ElectionOptionDto, UpdateElectionOptionDto } from '@libs/core/dto';
import { ElectionOption } from '@libs/core/database/entities';
import { UserGuard } from '@libs/core/auth/guards';
import { Roles } from '@libs/core/auth/decorators';
import { Role } from '@libs/core/database/enums';

@ApiTags('Election Option')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/election/option')
export class ElectionOptionController {
  constructor(private readonly service: ElectionOptionService) {}

  @Post()
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async create(
    @Body() electionOptionDto: ElectionOptionDto,
  ): Promise<ElectionOption> {
    return this.service.create(electionOptionDto);
  }

  @Delete(':id')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async delete(@Param('id') id: number): Promise<ElectionOption> {
    return this.service.delete(id);
  }

  @Patch(':id')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async update(
    @Param('id') id: number,
    @Body() updateElectionOptionDto: UpdateElectionOptionDto,
  ): Promise<ElectionOption> {
    return this.service.update(id, updateElectionOptionDto);
  }
}

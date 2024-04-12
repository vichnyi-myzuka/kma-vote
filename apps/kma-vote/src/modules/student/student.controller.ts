import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserGuard } from '@libs/core/auth/guards';
import { Roles } from '@libs/core/auth/decorators';
import { BaseStudent } from '@libs/core/database/entities';
import { Role } from '@libs/core/database/enums';
import { BaseStudentOutputDto } from '@libs/core/dto';
import { StudentService } from './student.service';

@ApiTags('Student')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/student')
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Get('search')
  // @UseGuards(UserGuard)
  // @Roles(Role.Admin)
  public async search(
    @Query() { name, take, skip },
  ): Promise<{ data: BaseStudentOutputDto[]; total: number }> {
    const { data, total } = await this.service.searchByName(name, take, skip);
    return {
      data: [
        ...data.map((baseStudent) => new BaseStudentOutputDto(baseStudent)),
      ],
      total,
    };
  }

  @Get()
  // @UseGuards(UserGuard)
  // @Roles(Role.Admin)
  public async findAll(@Query() { take, skip }): Promise<BaseStudent[]> {
    return this.service.findAll(take, skip);
  }

  @Get(':id')
  // @UseGuards(UserGuard)
  // @Roles(Role.Admin)
  public async findOne(@Param('cdoc') cdoc: number): Promise<BaseStudent> {
    return this.service.findOne(cdoc);
  }

  @Delete(':id')
  // @UseGuards(UserGuard)
  // @Roles(Role.Admin)
  public async delete(@Param('cdoc') cdoc: number): Promise<BaseStudent> {
    return this.service.delete(cdoc);
  }
}

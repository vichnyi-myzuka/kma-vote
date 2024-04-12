import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FilterOptionsData } from '@libs/core/database/types';
import { UserGuard } from '@libs/core/auth/guards';
import { Roles } from '@libs/core/auth/decorators';
import { Role } from '@libs/core/database/enums';
import { FilterOptionsService } from '@app/kma-vote/modules/election/services';

@ApiTags('Filter options')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/filterOptions')
export class FilterOptionsController {
  constructor(private readonly service: FilterOptionsService) {}

  @Get()
  public async getFilterOptionsData(): Promise<FilterOptionsData> {
    return {
      faculties: await this.service.getAllFacultyNames(),
      specialties: await this.service.getAllSpecialtyNamesGrouped(),
      degreeLevels: await this.service.getAllDegreeLevelsGrouped(),
      degreeYears: await this.service.getAllDegreeYearsGrouped(),
    };
  }

  @Get('facultyNames')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async getAllFacultyNames(): Promise<string[]> {
    return this.service.getAllFacultyNames();
  }

  @Get('specialtyNames')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async getAllSpecialtyNames(): Promise<string[]> {
    return this.service.getAllSpecialtyNames();
  }

  @Get('specialtyNames/grouped')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async getAllSpecialtyNamesGrouped(): Promise<
    Map<string, Map<string, string>>
  > {
    return this.service.getAllSpecialtyNamesGrouped();
  }

  @Get('degreeLevels')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async getAllDegreeLevels(): Promise<string[]> {
    return this.service.getAllDegreeLevels();
  }

  @Get('degreeLevels/grouped')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async getAllDegreeLevelsGrouped(): Promise<Map<string, string>> {
    return this.service.getAllDegreeLevelsGrouped();
  }

  @Get('degreeYears')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async getAllDegreeYears(): Promise<string[]> {
    return this.service.getAllDegreeYears();
  }

  @Get('degreeYears/grouped')
  @UseGuards(UserGuard)
  @Roles(Role.Admin)
  public async getAllDegreeYearsGrouped(): Promise<Map<string, string>> {
    return this.service.getAllDegreeYearsGrouped();
  }
}

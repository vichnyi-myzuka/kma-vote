import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ElectionStatus } from '@libs/core/database/enums';

export class StudentFilter {
  @ApiProperty()
  @IsString()
  @IsOptional()
  facultyName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  specialtyName?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  degreeLevel?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  degreeYear?: string[];

  static getAllProperties(): Record<string, string> {
    return {
      facultyName: 'facultyname',
      specialtyName: 'spec',
      degreeLevel: 'level',
      degreeYear: 'year',
    };
  }
}

export class ScenarioFilter {
  @ApiProperty()
  student: StudentFilter;
}

export interface FilterOptionsData {
  faculties: string[];
  specialties: Map<string, Map<string, string>>;
  degreeLevels: Map<string, string>;
  degreeYears: Map<string, string>;
}

export interface ElectionsFilterModel {
  status?: ElectionStatus;
}

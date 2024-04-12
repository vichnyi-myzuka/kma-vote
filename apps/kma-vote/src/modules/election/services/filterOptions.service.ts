import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStudent } from '@libs/core/database/entities';
import { getActiveStudents } from '@libs/core/database/utils';

@Injectable()
export class FilterOptionsService {
  constructor(
    @InjectRepository(BaseStudent, 'main')
    private studentRepository: Repository<BaseStudent>,
  ) {}

  public async getAllFacultyNames(): Promise<string[]> {
    const facultyNames = (
      await getActiveStudents(this.studentRepository, ['Student.facultyname'])
    )
      .map((student) => student.facultyname)
      .filter((value) => !!value);
    return facultyNames;
  }

  public async getAllSpecialtyNames(): Promise<string[]> {
    const specialtyNames = (
      await getActiveStudents(this.studentRepository, ['Student.spec'])
    )
      .map((student) => student.spec)
      .filter((value) => !!value);
    return specialtyNames;
  }

  public async getAllSpecialtyNamesGrouped(): Promise<
    Map<string, Map<string, string>>
  > {
    const specialtiesMap = new Map();

    const specialtyNamesPairs = (
      await getActiveStudents(this.studentRepository, [
        'Student.facultyname',
        'Student.spec',
        'Student.level',
      ])
    ).map((student) => ({
      facultyName: student.facultyname,
      specialtyName: student.spec,
      degreeLevel: student.level,
    }));

    specialtyNamesPairs.forEach(
      ({ facultyName, specialtyName, degreeLevel }) => {
        if (facultyName && specialtyName && degreeLevel) {
          if (!specialtiesMap.has(facultyName)) {
            const newDegreeMap = new Map();
            newDegreeMap.set(degreeLevel, [specialtyName]);
            specialtiesMap.set(facultyName, newDegreeMap);
          } else {
            const degreeMap = specialtiesMap.get(facultyName);
            if (!degreeMap.has(degreeLevel)) {
              degreeMap.set(degreeLevel, [specialtyName]);
            } else {
              degreeMap.get(degreeLevel).push(specialtyName);
            }
          }
        }
      },
    );

    return specialtiesMap;
  }

  public async getAllDegreeLevels(): Promise<string[]> {
    const degreeLevels = (
      await getActiveStudents(this.studentRepository, ['Student.level'])
    )
      .map((student) => student.level)
      .filter((value) => !!value);
    return degreeLevels;
  }

  public async getAllDegreeLevelsGrouped(): Promise<Map<string, string>> {
    const degreeLevelsMap = new Map();

    const degreeLevelsPairs = (
      await getActiveStudents(this.studentRepository, [
        'Student.facultyname',
        'Student.level',
      ])
    ).map((student) => ({
      degreeLevel: student.level,
      facultyName: student.facultyname,
    }));

    degreeLevelsPairs.forEach(({ degreeLevel, facultyName }) => {
      if (degreeLevel && facultyName) {
        if (!degreeLevelsMap.has(facultyName)) {
          degreeLevelsMap.set(facultyName, [degreeLevel]);
        } else {
          degreeLevelsMap.get(facultyName).push(degreeLevel);
        }
      }
    });

    return degreeLevelsMap;
  }

  public async getAllDegreeYears(): Promise<string[]> {
    const degreeYears = (
      await getActiveStudents(this.studentRepository, ['Student.year'])
    )
      .map((student) => student.year)
      .filter((value) => !!value);
    return degreeYears;
  }

  public async getAllDegreeYearsGrouped(): Promise<Map<string, string>> {
    const yearsMap = new Map();

    const yearsPairs = (
      await getActiveStudents(this.studentRepository, [
        'Student.level',
        'Student.year',
      ])
    ).map((student) => ({
      degreeLevel: student.level,
      degreeYear: student.year,
    }));

    yearsPairs.forEach(({ degreeLevel, degreeYear }) => {
      if (degreeLevel && degreeYear) {
        if (!yearsMap.has(degreeLevel)) {
          yearsMap.set(degreeLevel, [degreeYear]);
        } else {
          yearsMap.get(degreeLevel).push(degreeYear);
        }
      }
    });

    return yearsMap;
  }
}

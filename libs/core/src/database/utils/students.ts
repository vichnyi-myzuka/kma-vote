import { Repository } from 'typeorm';
import { BaseStudent } from '@libs/core/database/entities';

export const getActiveStudents = async (
  studentRepository: Repository<BaseStudent>,
  distinctOnValues?: string[],
): Promise<BaseStudent[]> => {
  let filteredActiveStudents = studentRepository
    .createQueryBuilder('Student')
    .where('Student.status = :status', { status: 1 });

  if (distinctOnValues) {
    filteredActiveStudents =
      filteredActiveStudents.distinctOn(distinctOnValues);
  }
  return filteredActiveStudents.getMany();
};

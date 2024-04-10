import { Entity } from 'typeorm';
import { BaseStudent } from '@libs/core/database/entities';

@Entity({ name: 'View_Data_student_service' })
export class SqlServerStudent extends BaseStudent {}

import { BaseEntity } from './base';

export class TaskEntity extends BaseEntity {
  name: string;
  description: string;
  due_date: Date;
}

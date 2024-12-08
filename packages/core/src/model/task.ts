import { BaseModel, BaseModelParams } from '.';
import { TaskEntity } from '../entity';

enum TaskStatus {
  NotUrgent = 'NOT_URGENT',
  DueSoon = 'DUE_SOON',
  Overdue = 'OVERDUE',
}

export class TaskModel extends BaseModel {
  name: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;

  constructor(params: TaskModelParams) {
    super(params);

    const { name, description, dueDate } = params;

    this.name = name;
    this.description = description;
    this.dueDate = dueDate;

    const now = new Date();
    this.status = TaskStatus.NotUrgent;
    if (dueDate < now) {
      this.status = TaskStatus.Overdue;
    } else if (dueDate.getTime() - now.getTime() < 1000 * 60 * 60 * 24 * 7) {
      this.status = TaskStatus.DueSoon;
    }
  }

  toEntity(): TaskEntity {
    return {
      ...super.toEntity(),
      name: this.name,
      description: this.description,
      due_date: this.dueDate,
    };
  }

  static fromEntity(obj: TaskEntity): TaskModel {
    return new TaskModel({
      ...super.fromEntity(obj),
      name: obj.name,
      description: obj.description,
      dueDate: obj.due_date,
    });
  }
}

interface TaskModelParams extends BaseModelParams {
  name: string;
  description: string;
  dueDate: Date;
  status?: TaskStatus;
}

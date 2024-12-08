import { PaginationResult, TaskModel, TaskRepository } from '@checkbox/core';

export class TaskService {
  private readonly taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async create(params: CreateParams): Promise<TaskModel> {
    const model = new TaskModel(params);

    return this.taskRepository.create(model);
  }

  async update(params: UpdateParams): Promise<TaskModel> {
    return this.taskRepository.update({
      id: params.id,
      name: params.name,
      description: params.description,
      dueDate: params.dueDate,
    });
  }

  async delete(id: string): Promise<void> {
    return this.taskRepository.delete(id);
  }

  async findOne(id: string): Promise<TaskModel | null> {
    return this.taskRepository.findOne(id);
  }

  async findPaged(params: FindPagedParams): Promise<PaginationResult<TaskModel>> {
    return this.taskRepository.findPaged(params);
  }
}

interface FindPagedParams {
  page?: number;
  limit?: number;
  sort?: Record<string, 'asc' | 'desc'>;
  name?: string;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

interface CreateParams {
  name: string;
  description: string;
  dueDate: Date;
}

interface UpdateParams {
  id: string;
  name?: string;
  description?: string;
  dueDate?: Date;
}

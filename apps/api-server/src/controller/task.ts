import { TaskService } from '@checkbox-api-server/service';
import { BaseController } from './base';
import { Request, Response, NextFunction } from 'express';
import { createTaskSchema, deleteTaskSchema, getTaskSchema, getTasksSchema, updateTaskSchema } from './schema';

export class TaskController extends BaseController {
  private readonly taskService: TaskService;

  constructor(taskService: TaskService) {
    super();
    this.taskService = taskService;

    this.router.get('', this.findPaged.bind(this));
    this.router.get('/:id', this.findOne.bind(this));
    this.router.post('', this.create.bind(this));
    this.router.patch('/:id', this.update.bind(this));
    this.router.delete('/:id', this.delete.bind(this));
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await getTaskSchema.validate(req);
      const result = await this.taskService.findOne(data.params.id);
      if (!result) {
        res.status(404).json(null);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async findPaged(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await getTasksSchema.validate(req);
      const result = await this.taskService.findPaged({
        page: data.query.page,
        limit: data.query.limit,
        name: data.query.name,
        createdAtFrom: data.query.created_at_from ? new Date(data.query.created_at_from) : undefined,
        createdAtTo: data.query.created_at_to ? new Date(data.query.created_at_to) : undefined,
        dueDateFrom: data.query.due_date_from ? new Date(data.query.due_date_from) : undefined,
        dueDateTo: data.query.due_date_to ? new Date(data.query.due_date_to) : undefined,
        sort: Object.entries(data.query.sort).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {}
        ) as unknown as Record<string, 'asc' | 'desc'>,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await createTaskSchema.validate(req);
      const result = await this.taskService.create({
        name: data.body.name,
        description: data.body.description,
        dueDate: new Date(data.body.due_date),
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await updateTaskSchema.validate(req);
      const result = await this.taskService.update({
        id: data.params.id,
        name: data.body.name,
        description: data.body.description,
        dueDate: data.body.due_date ? new Date(data.body.due_date) : undefined,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deleteTaskSchema.validate(req);
      await this.taskService.delete(data.params.id);

      res.status(204).json(null);
    } catch (error) {
      next(error);
    }
  }
}

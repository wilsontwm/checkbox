import { Knex } from 'knex';
import { TaskModel } from '../model';
import { isEmpty, omitBy } from 'lodash';
import { BaseFindPagedParams, PaginationResult } from './base';

export class TaskRepository {
  private readonly knex: Knex;
  private readonly tableName: string = 'tasks';

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async create(model: TaskModel): Promise<TaskModel> {
    const result = await this.knex(this.tableName).insert(model.toEntity()).returning('*');

    return TaskModel.fromEntity(result[0]);
  }

  async update(params: UpdateParams): Promise<TaskModel> {
    console.log('params', params);
    const payload = omitBy(
      {
        name: params.name,
        description: params.description,
        due_date: params.dueDate,
        updated_at: new Date(),
      },
      (value) => value === undefined
    );

    const result = await this.knex(this.tableName).where({ id: params.id }).update(payload).returning('*');

    return TaskModel.fromEntity(result[0]);
  }

  async delete(id: string): Promise<void> {
    await this.knex(this.tableName).where({ id }).delete();
  }

  async findPaged(params: FindPagedParams): Promise<PaginationResult<TaskModel>> {
    const { page = 1, limit = 10, sort, ...where } = params;

    const query = this.knex(this.tableName)
      .select()
      .where((builder) => {
        if (where.createdAtFrom) {
          builder.where('created_at', '>=', where.createdAtFrom);
        }

        if (where.createdAtTo) {
          builder.where('created_at', '<=', where.createdAtTo);
        }

        if (where.dueDateFrom) {
          builder.where('due_date', '>=', where.dueDateFrom);
        }

        if (where.dueDateTo) {
          builder.where('due_date', '<=', where.dueDateTo);
        }

        if (where.name) {
          builder.where('name', 'ilike', `%${where.name}%`);
        }

        return builder;
      });

    const [total, data] = await Promise.all([
      query.clone().count(),
      query
        .clone()
        .orderByRaw(
          Object.entries(isEmpty(sort) ? { created_at: 'desc' } : sort)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ')
        )
        .limit(limit)
        .offset((page - 1) * limit),
    ]);

    const totalCount = Number(total[0].count);

    return {
      data: data.map(TaskModel.fromEntity),
      total: totalCount,
      hasMore: page * limit < totalCount,
    };
  }

  async findOne(id: string): Promise<TaskModel | null> {
    const result = await this.knex(this.tableName).where({ id }).first();

    return result ? TaskModel.fromEntity(result) : null;
  }
}

interface UpdateParams {
  id: string;
  name?: string;
  description?: string;
  dueDate?: Date;
}

interface FindPagedParams extends BaseFindPagedParams {
  name?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  createdAtFrom?: Date;
  createdAtTo?: Date;
}

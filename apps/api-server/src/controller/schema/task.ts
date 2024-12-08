import { number, object, string } from 'yup';

export const createTaskSchema = object({
  body: object({
    name: string().required(),
    description: string().required(),
    due_date: string().datetime().required(),
  }).required(),
});

export const updateTaskSchema = object({
  params: object({
    id: string().required(),
  }).required(),
  body: object({
    name: string(),
    description: string(),
    due_date: string().datetime(),
  }).required(),
});

export const deleteTaskSchema = object({
  params: object({
    id: string().required(),
  }).required(),
});

export const getTaskSchema = object({
  params: object({
    id: string().required(),
  }).required(),
});

enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export const getTasksSchema = object({
  query: object({
    page: number().integer().min(1),
    limit: number().integer().min(1).max(50),
    sort: object({
      name: string().oneOf(Object.keys(SortOrder)),
      description: string().oneOf(Object.keys(SortOrder)),
      due_date: string().oneOf(Object.keys(SortOrder)),
    }),
    name: string(),
    due_date_from: string().datetime(),
    due_date_to: string().datetime(),
    created_at_from: string().datetime(),
    created_at_to: string().datetime(),
  }),
});

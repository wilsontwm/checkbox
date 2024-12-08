import { apiBaseUrl } from '@/constants';
import { PaginationResult, TaskModel } from '@checkbox/core';
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { isEmpty } from 'lodash-es';

interface GetTasksParams {
  page?: number;
  limit?: number;
  sort?: Record<string, 'asc' | 'desc'>;
  name?: string;
}

export const useGetTasks = (params: GetTasksParams): UseQueryResult<PaginationResult<TaskModel>> => {
  const queryFn = async () => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'sort') {
          console.log('keyyy', key, value);
          if (!isEmpty(value)) searchParams.append(`sort[${Object.keys(value)[0]}]`, Object.values(value)[0] as string);
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    const response = await fetch(`${apiBaseUrl}/tasks?${searchParams.toString()}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const result = await response.json();

    return result as PaginationResult<TaskModel>;
  };

  return useQuery({
    queryKey: ['getTasks', params],
    queryFn,
  });
};

interface CreateTaskParams {
  name: string;
  description: string;
  due_date: Date;
}

export const useCreateTask = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const mutationFn = async (data: CreateTaskParams) => {
    const response = await fetch(`${apiBaseUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    const result = await response.json();

    return result as TaskModel;
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      // Invalidate the query
      queryClient.invalidateQueries({
        queryKey: ['getTasks'],
      });
      onSuccess?.();
    },
  });
};

interface UpdateTaskParams {
  id: string;
  name?: string;
  description?: string;
  due_date?: Date;
}

export const useUpdateTask = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const mutationFn = async (data: UpdateTaskParams) => {
    const response = await fetch(`${apiBaseUrl}/tasks/${data.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    const result = await response.json();

    return result as TaskModel;
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      // Invalidate the query
      queryClient.invalidateQueries({
        queryKey: ['getTasks'],
      });
      onSuccess?.();
    },
  });
};

export const useDeleteTask = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const mutationFn = async (id: string) => {
    const response = await fetch(`${apiBaseUrl}/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      // Invalidate the query
      queryClient.invalidateQueries({
        queryKey: ['getTasks'],
      });
      onSuccess?.();
    },
  });
};

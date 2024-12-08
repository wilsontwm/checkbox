import { useEffect, useState } from 'react';
import './App.css';
import { useDeleteTask, useGetTasks } from './hooks';
import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui';
import { format } from 'date-fns';
import { debounce } from 'lodash-es';
import TaskDialog from './components/tasks/task-dialog';
import { TaskModel } from '@checkbox/core';

const defaultLimit = 10;

function App() {
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<Record<string, 'asc' | 'desc'>>({});
  const getTasksQueries = useGetTasks({ page, limit: defaultLimit, name: search, sort });
  const tasks = getTasksQueries.data?.data || [];
  const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null);

  const deleteTaskMutation = useDeleteTask({});

  const onSelectTask = (task: TaskModel) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const onCreateNewTask = () => {
    setSelectedTask(null);
    setOpenDialog(true);
  };

  const onDeleteTask = (task: TaskModel) => {
    if (!task.id) return;

    deleteTaskMutation.mutate(task.id);
  };

  const onSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, 300);

  const onChangeSort = (field: string) => {
    setSort({
      [field]: 'desc',
    });
  };

  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between'>
          <Button onClick={onCreateNewTask}>Create New</Button>
          <div className='flex flex-row gap-2'>
            <Input type='text' placeholder='Search' onChange={onSearch} />
            <Select onValueChange={onChangeSort}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Sort Order' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='due_date'>Due Date</SelectItem>
                <SelectItem value='created_at'>Created At</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className='cursor-pointer' onClick={() => onSelectTask(task)}>
                <TableCell className='text-left'>{task.id}</TableCell>
                <TableCell className='text-left'>{task.name}</TableCell>
                <TableCell className='text-left'>{task.description}</TableCell>
                <TableCell className='text-left'>{format(task.dueDate, 'yyyy-MM-dd HH:mm')}</TableCell>
                <TableCell className='text-left'>{task.status.toString().replaceAll('_', ' ')}</TableCell>
                <TableCell className='text-left'>
                  {task.createdAt ? format(task.createdAt, 'yyyy-MM-dd HH:mm') : '-'}
                </TableCell>
                <TableCell>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className='flex gap-2'>
          <Button variant='outline' size='sm' disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            disabled={!getTasksQueries.data?.hasMore}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
      <TaskDialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)} task={selectedTask ?? undefined} />
    </>
  );
}

export default App;

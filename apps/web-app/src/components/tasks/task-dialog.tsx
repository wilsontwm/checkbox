import { TaskModel } from '@checkbox/core';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  Dialog,
  DialogTitle,
  DialogContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from '../ui';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useCreateTask, useUpdateTask } from '@/hooks';

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  due_date: z.date(),
});

interface TaskDialogProps {
  task?: TaskModel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
function TaskDialog(props: TaskDialogProps) {
  const { task, open, onOpenChange } = props;

  const createTaskMutation = useCreateTask({ onSuccess: () => onOpenChange(false) });
  const updateTaskMutation = useUpdateTask({ onSuccess: () => onOpenChange(false) });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: task?.name ?? '',
      description: task?.description ?? '',
      due_date: task?.dueDate ? new Date(task.dueDate) : undefined,
    },
  });

  useEffect(() => {
    form.reset({
      name: task?.name ?? '',
      description: task?.description ?? '',
      due_date: task?.dueDate ? new Date(task.dueDate) : undefined,
    });
  }, [task]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (task) {
      updateTaskMutation.mutate({
        id: task.id!,
        name: values.name,
        description: values.description,
        due_date: values.due_date,
      });
    } else {
      createTaskMutation.mutate({
        name: values.name,
        description: values.description,
        due_date: values.due_date,
      });
    }
  };

  return (
    <Dialog key={task?.id ?? 'new'} open={open} onOpenChange={onOpenChange}>
      <DialogTitle hidden>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Task #1' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Description of the task' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='due_date'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={createTaskMutation.isPending || updateTaskMutation.isPending}>
              {createTaskMutation.isPending || updateTaskMutation.isPending ? 'Loading...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default TaskDialog;

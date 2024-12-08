import { knexClient, TaskRepository } from '@checkbox/core';
import { TaskController } from './controller';
import { TaskService } from './service';

export type ControllerContainer = {
  taskController: TaskController;
};
export class Container {
  controller: ControllerContainer;

  constructor() {
    // Repository
    const taskRepository = new TaskRepository(knexClient);

    // Service
    const taskService = new TaskService(taskRepository);

    // Controller
    const taskController = new TaskController(taskService);

    this.controller = {
      taskController,
    };
  }
}

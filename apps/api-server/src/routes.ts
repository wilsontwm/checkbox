import { Application } from 'express';
import { Container } from './container';

export async function setupRoutes(app: Application, container: Container) {
  const { controller } = container;

  app.get('/', (req, res) => {
    res.send('Checkbox API server is running...');
  });

  app.use('/tasks', controller.taskController.getRouter());
}

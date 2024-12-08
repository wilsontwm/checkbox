import bodyParser from 'body-parser';
import express, { Application, RequestHandler, urlencoded } from 'express';
import { Container } from './container';
import { errorMiddleware } from './middleware/error.middleware';
import { setupRoutes } from './routes';

/**
 * Main function to set up Express application here
 */

export async function createApp(): Promise<Application> {
  const app = express();
  const container = new Container();
  app.use(bodyParser.json());
  app.use(urlencoded({ extended: true }) as RequestHandler);

  await setupRoutes(app, container);
  app.use(errorMiddleware);

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.info(`Checkbox API server listening on port ${port}`);
  });

  return app;
}

createApp().catch((err) => {
  console.error(err, 'Failed to start server');
});

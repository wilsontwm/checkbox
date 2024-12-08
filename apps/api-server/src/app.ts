import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application, RequestHandler, urlencoded } from 'express';
import { Container } from './container';
import { errorMiddleware } from './middleware/error.middleware';
import { setupRoutes } from './routes';
import { ForbiddenError } from './libs/errors';

/**
 * Main function to set up Express application here
 */

export async function createApp(): Promise<Application> {
  const app = express();
  const container = new Container();
  app.use(bodyParser.json());
  app.use(urlencoded({ extended: true }) as RequestHandler);

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map((pattern) => new RegExp(pattern));
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.some((regex) => regex.test(origin))) {
          callback(null, true);
        } else {
          callback(new ForbiddenError('Not allowed by CORS'));
        }
      },
    })
  );

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

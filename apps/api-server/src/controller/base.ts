import { Router } from 'express';

export abstract class BaseController {
  protected readonly router: Router;

  constructor() {
    this.router = Router();
  }

  public getRouter(): Router {
    return this.router;
  }
}

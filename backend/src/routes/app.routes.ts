import { NextFunction, Request, Response, Router } from 'express';

import appBackend from '../backend/app';

import { Errors } from './../shared';

export class AppRouter {
  public router: Router;

  public constructor() {
    this.router = Router();
    this.init();
  }

  public find(req: Request, res: Response, next: NextFunction) {
    appBackend
      .find()
      .then((r) => res.json(r))
      .catch(next);
  }

  public findByCategory(req: Request, res: Response, next: NextFunction) {
    const { category } = req.params as { category: string };
    if (!category) return res.json({ error: { code: Errors.BAD_REQUEST } });
    appBackend
      .findByCategory(category)
      .then((r) => res.json(r))
      .catch(next);
  }

  public init() {
    this.router.get('/', this.find);
    this.router.get('/:category', this.findByCategory);
  }
}

const appRouter = new AppRouter();
export default appRouter.router;

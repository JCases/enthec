import { NextFunction, Request, Response, Router } from 'express';

import userBackend from '../backend/user';

import { Errors } from './../shared';

export class UserRouter {
  public router: Router;

  public constructor() {
    this.router = Router();
    this.init();
  }

  public getUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params as { id: string };
    if (!id) return res.json({ error: { code: Errors.BAD_REQUEST } });
    userBackend
      .getUser(id)
      .then((r) => res.json(r))
      .catch(next);
  }

  public paginationUsers(req: Request, res: Response, next: NextFunction) {
    const { page, limit } = req.query as { page: string; limit: string };
    if (limit !== undefined) {
      if (+limit % 20 !== 0) {
        return res.json({ error: { code: Errors.BAD_REQUEST } });
      }
    }
    if (
      (isNaN(+page) && page !== undefined) ||
      (isNaN(+limit) && limit !== undefined)
    ) {
      return res.json({ error: { code: Errors.BAD_REQUEST } });
    }
    userBackend
      .paginationUsers(+page, +limit)
      .then((r) => res.json(r))
      .catch(next);
  }

  public init() {
    this.router.get('/:id', this.getUser);
    this.router.get('/', this.paginationUsers);
  }
}

const userRouter = new UserRouter();
export default userRouter.router;

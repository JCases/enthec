import { Errors } from '..';

export interface IResponse<T> {
  error?: { message?: string; code: Errors };
  result?: T;
}

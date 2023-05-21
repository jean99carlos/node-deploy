import { Result } from "../domain/Result";

export interface IRepositorio<T> {
  get(): Promise<Result<T[]>>;
  getById(id:string): Promise<Result<T>>;
  create(param: T): Promise<Result<T>>;
  update(param: T): Promise<Result<T>>;
  delete(param: T): Promise<Result<T>>;
}

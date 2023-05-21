import { Result } from "../domain/Result";

export interface IAppService<T> {
  get(): Promise<Result<T[]>>;
  create(dto: T): Promise<Result<T>>;
  delete(id: string): Promise<Result<T>>;
  getById(id?: string): Promise<Result<T>>;
  update(dto: T): Promise<Result<T>>;
}

import { Result } from "../domain/Result";
import { IRepositorio } from "../repository/IRepositorio";
import { IService } from "./IService";

export abstract class ServiceBase<T> implements IService<T> {
  constructor(protected repo: IRepositorio<T>) {}

  async get(): Promise<Result<T[]>> {
    return this.repo.get();
  }

  async getById(id: string): Promise<Result<T>> {
    return this.repo.getById(id);
  }

  async create(param: T): Promise<Result<T>> {
    return this.repo.create(param);
  }

  async update(param: T): Promise<Result<T>> {
    return this.repo.update(param);
  }

  async delete(id: string): Promise<Result<T>> {
    const register = await this.getById(id);
    if (register.isFailure) {
      return Result.fail<T>(register.error ?? "");
    }
    return this.repo.delete(register.getValue());
  }
}

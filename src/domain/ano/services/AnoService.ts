import { Ano } from "../entities/Ano";
import { IAnoRepositorio } from "../interfaces/repository/IAnoRepositorio";
import { IAnoService } from "../../../aplication/interfaces/services/ano/IAnoService";
import { Result } from "../../../core/domain/Result";

export class AnoService implements IAnoService {
  constructor(private repo: IAnoRepositorio) {}

  async get(): Promise<Result<Ano[]>> {
    return this.repo.get();
  }

  async getById(id: string): Promise<Result<Ano>> {
    return this.repo.getById(id);
  }

  async create(param: Ano): Promise<Result<Ano>> {
    return this.repo.create(param);
  }

  async update(param: Ano): Promise<Result<Ano>> {
    return this.repo.update(param);
  }

  async delete(id: string): Promise<Result<Ano>> {
    const register = await this.getById(id);
    if (register.isFailure) {
      return Result.fail<Ano>(register.error ?? "");
    }
    return this.repo.delete(register.getValue());
  }
}

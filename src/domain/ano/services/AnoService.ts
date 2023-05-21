import { Ano } from "../entities/Ano";
import { IAnoRepositorio } from "../interfaces/repository/IAnoRepositorio";
import { IAnoService } from "../../../aplication/interfaces/services/ano/IAnoService";
import { Result } from "../../../core/domain/Result";

export class AnoService implements IAnoService {
  constructor(private repo: IAnoRepositorio) {}

  get(): Promise<Result<Ano[]>> {
    return this.repo.get();
  }

  getById(id: string): Promise<Result<Ano>> {
    return this.repo.getById(id);
  }

  create(param: Ano): Promise<Result<Ano>> {
    return this.repo.create(param);
  }

  update(param: Ano): Promise<Result<Ano>> {
    return this.repo.update(param);
  }

  delete(param: Ano): Promise<Result<void>> {
    return this.repo.delete(param);
  }
}

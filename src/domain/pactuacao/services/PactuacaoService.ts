import { Pactuacao } from "../entities/Pactuacao";
import { Result } from "../../../core/domain/Result";
import { IPactuacaoRepositorio } from "../interfaces/repository/IPactuacaoRepositorio";
import { IPactuacaoService } from "../../../aplication/interfaces/services/pactuacao/IPactuacaoService";

export class PactuacaoService implements IPactuacaoService {
  constructor(private repo: IPactuacaoRepositorio) {}

  async get(): Promise<Result<Pactuacao[]>> {
    return this.repo.get();
  }

  async getById(id: string): Promise<Result<Pactuacao>> {
    return this.repo.getById(id);
  }

  async create(param: Pactuacao): Promise<Result<Pactuacao>> {
    return this.repo.create(param);
  }

  async update(param: Pactuacao): Promise<Result<Pactuacao>> {
    return this.repo.update(param);
  }

  async delete(id: string): Promise<Result<Pactuacao>> {
    const register = await this.getById(id);
    if (register.isFailure) {
      return Result.fail<Pactuacao>(register.error ?? "");
    }
    return this.repo.delete(register.getValue());
  }
}

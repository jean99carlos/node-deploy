import { Ano } from "../entities/Ano";
import { IAnoRepositorio } from "../interfaces/repository/IAnoRepositorio";
import { IAnoService } from "../../../aplication/interfaces/services/ano/IAnoService";

export class AnoService implements IAnoService {
  constructor(private repo: IAnoRepositorio) {}
 
  get(): Promise<Ano[] | undefined> {
    return this.repo.get();
  }

  getById(id: string): Promise<Ano | undefined> {
    return this.repo.getById(id);
  }

  create(param: Ano): Promise<Ano> {
    return this.repo.create(param);
  }
  
  update(param: Ano): Promise<Ano> {
    return this.repo.update(param);
  }
 
  delete(param: Ano): Promise<void> {
    return this.repo.delete(param);
  }
}

import { Ano } from "../entities/Ano";
import { IAnoRepositorio } from "../interfaces/repository/IAnoRepositorio";
import { ServiceBase } from "../../../core/services/ServiceBase";
import { IAnoService } from "../../../aplication/services/ano/interfaces/services/IAnoService";

export class AnoService extends ServiceBase<Ano> implements IAnoService {
  constructor(repo: IAnoRepositorio) {
    super(repo);
  }
}

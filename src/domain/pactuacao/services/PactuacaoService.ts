import { Pactuacao } from "../entities/Pactuacao";
import { IPactuacaoRepositorio } from "../interfaces/repository/IPactuacaoRepositorio";
import { ServiceBase } from "../../../core/services/ServiceBase";
import { IPactuacaoService } from "../../../aplication/services/pactuacao/interfaces/services/IPactuacaoService";

export class PactuacaoService
  extends ServiceBase<Pactuacao>
  implements IPactuacaoService
{
  constructor(repo: IPactuacaoRepositorio) {
    super(repo);
  }
}

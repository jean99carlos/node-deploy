import { PrismaContext } from "../../../../core/repository/PrismaContext";
import { Pactuacao } from "../../../../domain/pactuacao/entities/Pactuacao";
import { PactuacaoMapper } from "../../../crosscutting/adapter/mappers/PactuacaoMapper";
import { RepositorioBase } from "../../../../core/repository/RepositorioBase";
import { Pactuacao as PactuacaoPrisma } from "@prisma/client";
import { IPactuacaoRepositorio } from "../../../../domain/pactuacao/interfaces/repository/IPactuacaoRepositorio";
export class PactuacaoRepositorio
  extends RepositorioBase<Pactuacao, PactuacaoPrisma>
  implements IPactuacaoRepositorio
{
  constructor() {
    const { pactuacao } = PrismaContext.getInstance();
    const mapper = PactuacaoMapper.getInstance();
    super(mapper, pactuacao);
  }
}

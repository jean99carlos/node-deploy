import { Pactuacao as PactuacaoPrisma } from "@prisma/client";
import { Pactuacao } from "../entities/Pactuacao";
import { IDomainMapper } from "../../../core/mapper/IDomainMapper";

export interface IPactuacaoDomainMapper
  extends IDomainMapper<Pactuacao, PactuacaoPrisma> {}

import { Ano } from "../../../../domain/ano/entities/Ano";
import { PrismaContext } from "../../../../core/repository/PrismaContext";
import { AnoMapper } from "../../../crosscutting/adapter/mappers/AnoMapper";
import { RepositorioBase } from "../../../../core/repository/RepositorioBase";
import { Ano as AnoPrisma } from "@prisma/client";
import { IAnoRepositorio } from "../../../../domain/ano/interfaces/repository/IAnoRepositorio";
export class AnoRepositorio extends RepositorioBase<Ano, AnoPrisma> implements IAnoRepositorio {
  constructor() {
    const { ano } = PrismaContext.getInstance();
    const mapper =AnoMapper.getInstance();
    super(mapper, ano);
  }
}

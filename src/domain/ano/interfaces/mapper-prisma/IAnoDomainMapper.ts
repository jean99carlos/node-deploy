import { IDomainMapper } from "../../../../core/mapper/IDomainMapper";
import { Ano } from "../../entities/Ano";
import { Ano as AnoPrisma } from "@prisma/client";

export interface IAnoDomainMapper extends IDomainMapper<Ano, AnoPrisma> {}

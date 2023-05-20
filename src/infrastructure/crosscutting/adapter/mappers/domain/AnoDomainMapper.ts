import { Ano as AnoDomain } from "../../../../../domain/ano/entities/Ano";
import { Ano as AnoDTO } from "@prisma/client";
import { IAnoDomainMapper } from "../../../../../domain/ano/interfaces/mapper-prisma/IAnoDomainMapper";

export class AnoDomainMapper implements IAnoDomainMapper {
  private static instance: AnoDomainMapper;

  private constructor() {}

  public static getInstance(): AnoDomainMapper {
    if (!AnoDomainMapper.instance) {
      AnoDomainMapper.instance = new AnoDomainMapper();
    }
    return AnoDomainMapper.instance;
  }
  toDomain(raw: AnoDTO): AnoDomain {
    return AnoDomain.create({ descricao: raw.descricao }, raw.id ?? undefined);
  }
  toPersistence(ano: AnoDomain): AnoDTO {
    return {
      id: ano.id,
      descricao: ano.props.descricao,
    };
  }
}

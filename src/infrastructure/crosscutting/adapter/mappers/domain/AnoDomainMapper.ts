import { Ano as AnoDomain } from "../../../../../domain/ano/entities/Ano";
import { Ano as AnoDTO } from "@prisma/client";
import { IAnoDomainMapper } from "../../../../../domain/ano/interfaces/mapper-prisma/IAnoDomainMapper";
import { Result } from "../../../../../core/domain/Result";

export class AnoDomainMapper implements IAnoDomainMapper {
  private static instance: AnoDomainMapper;

  private constructor() {}

  public static getInstance(): AnoDomainMapper {
    if (!AnoDomainMapper.instance) {
      AnoDomainMapper.instance = new AnoDomainMapper();
    }
    return AnoDomainMapper.instance;
  }
  toDomain(raw: AnoDTO): Result<AnoDomain> {
    const result = AnoDomain.create(
      { descricao: raw.descricao },
      raw.id ?? undefined
    );
    return result;
  }
  toPersistence(ano: AnoDomain): Result<AnoDTO> {
    try {
      return Result.ok({
        id: ano.id,
        descricao: ano.props.descricao,
      });
    } catch (error) {
      console.log(error);
      return Result.fail("Fail to parse to persistence format");
    }
  }
}

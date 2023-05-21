import { Pactuacao as PactuacaoDomain } from "../../../../../domain/pactuacao/entities/Pactuacao";
import { Pactuacao as PactuacaoDTO } from "@prisma/client";
import { Result } from "../../../../../core/domain/Result";
import { IPactuacaoDomainMapper } from "../../../../../domain/pactuacao/mapper-prisma/IPactuacaoDomainMapper";

export class PactuacaoDomainMapper implements IPactuacaoDomainMapper {
  private static instance: PactuacaoDomainMapper;

  private constructor() {}

  public static getInstance(): PactuacaoDomainMapper {
    if (!PactuacaoDomainMapper.instance) {
      PactuacaoDomainMapper.instance = new PactuacaoDomainMapper();
    }
    return PactuacaoDomainMapper.instance;
  }
  toDomain(raw: PactuacaoDTO): Result<PactuacaoDomain> {
    const result = PactuacaoDomain.create(
      { descricao: raw.descricao, programa: raw.programa },
      raw.id ?? undefined
    );
    return result;
  }
  toPersistence(object: PactuacaoDomain): Result<PactuacaoDTO> {
    try {
      return Result.ok({
        id: object.id,
        descricao: object.props.descricao,
        programa: object.props.programa,
      });
    } catch (error) {
      console.log(error);
      return Result.fail("Fail to parse to persistence format");
    }
  }
}

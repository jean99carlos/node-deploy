import { Ano } from "../../../../domain/ano/entities/Ano";
import { AnoDTO } from "../../../../aplication/services/ano/dtos/AnoDTO";
import { Result } from "../../../../core/domain/Result";
import { IAnoMapper } from "../../../../aplication/services/ano/mapper/IAnoMapper";

export class AnoMapper implements IAnoMapper {
  private static instance: AnoMapper;

  private constructor() {}

  public static getInstance(): AnoMapper {
    if (!AnoMapper.instance) {
      AnoMapper.instance = new AnoMapper();
    }
    return AnoMapper.instance;
  }

  toDomain(raw: any): Result<Ano> {
    const result = Ano.create(
      { descricao: raw.descricao },
      raw.id ?? undefined
    );
    return result;
  }

  toPersistence(ano: Ano): Result<any> {
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
  
  toDTO(ano: Ano): Result<AnoDTO> {
    return Result.ok({
      id: ano.id,
      descricao: ano.props.descricao,
    });
  }
}

import { Ano } from "../../../../../domain/ano/entities/Ano";
import { AnoDTO } from "../../../../../aplication/dto/AnoDTO";
import { Result } from "../../../../../core/domain/Result";

export class AnoAppMapper {
  private static instance: AnoAppMapper;

  private constructor() {}

  public static getInstance(): AnoAppMapper {
    if (!AnoAppMapper.instance) {
      AnoAppMapper.instance = new AnoAppMapper();
    }
    return AnoAppMapper.instance;
  }
  toEntity(raw: AnoDTO): Result<Ano> {
    return Ano.create({ descricao: raw.descricao }, raw.id);
  }

  toDTO(ano: Ano): Result<AnoDTO> {
    return Result.ok({
      id: ano.id,
      descricao: ano.props.descricao,
    });
  }
}

import { Ano } from "../../../../../domain/ano/entities/Ano";
import { AnoDTO } from "../../../../../aplication/dto/AnoDTO";

export class AnoAppMapper {
  private static instance: AnoAppMapper;

  private constructor() {}

  public static getInstance(): AnoAppMapper {
    if (!AnoAppMapper.instance) {
      AnoAppMapper.instance = new AnoAppMapper();
    }
    return AnoAppMapper.instance;
  }
  toEntity(raw: AnoDTO): Ano {
    return Ano.create({ descricao: raw.descricao }, raw.id ?? undefined);
  }

  toDTO(ano: Ano): AnoDTO {
    return {
      id: ano.id,
      descricao: ano.props.descricao,
    };
  }
}

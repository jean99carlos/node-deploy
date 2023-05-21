import { Result } from "../../../../../core/domain/Result";
import { IPactuacaoAppMapper } from "../../../../../aplication/interfaces/mapper/IPactuacaoAppMapper";
import { Pactuacao } from "../../../../../domain/pactuacao/entities/Pactuacao";
import { PactuacaoDTO } from "../../../../../aplication/dto/PactuacaoDTO";

export class PactuacaoAppMapper implements IPactuacaoAppMapper {
  private static instance: PactuacaoAppMapper;

  private constructor() {}

  public static getInstance(): PactuacaoAppMapper {
    if (!PactuacaoAppMapper.instance) {
      PactuacaoAppMapper.instance = new PactuacaoAppMapper();
    }
    return PactuacaoAppMapper.instance;
  }
  toEntity(raw: PactuacaoDTO): Result<Pactuacao> {
    return Pactuacao.create(
      { descricao: raw.descricao, programa: raw.programa },
      raw.id
    );
  }

  toDTO(dto: Pactuacao): Result<PactuacaoDTO> {
    return Result.ok({
      id: dto.id,
      descricao: dto.props.descricao,
      programa: dto.props.programa,
    });
  }
}

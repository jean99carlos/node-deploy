import { Pactuacao } from "../../../../domain/pactuacao/entities/Pactuacao";
import { Result } from "../../../../core/domain/Result";
import { IPactuacaoMapper } from "../../../../aplication/services/pactuacao/mapper/IPactuacaoMapper";
import { PactuacaoDTO } from "../../../../aplication/services/pactuacao/dtos/PactuacaoDTO";

export class PactuacaoMapper implements IPactuacaoMapper {
  private static instance: PactuacaoMapper;

  private constructor() {}

  public static getInstance(): PactuacaoMapper {
    if (!PactuacaoMapper.instance) {
      PactuacaoMapper.instance = new PactuacaoMapper();
    }
    return PactuacaoMapper.instance;
  }
  toDomain(raw: any): Result<Pactuacao> {
    const result = Pactuacao.create(
      { descricao: raw.descricao, programa: raw.programa },
      raw.id ?? undefined
    );
    return result;
  }
  toPersistence(object: Pactuacao): Result<any> {
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
  toDTO(object: Pactuacao): Result<PactuacaoDTO> {
    return Result.ok({
      id: object.id,
      descricao: object.props.descricao,
      programa: object.props.programa,
    });
  }
}

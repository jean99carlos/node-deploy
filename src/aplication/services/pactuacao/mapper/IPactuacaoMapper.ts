import { Pactuacao } from "../../../../domain/pactuacao/entities/Pactuacao";
import { IMapper } from "../../../../core/mapper/IMapper";
import { PactuacaoDTO } from "../dtos/PactuacaoDTO";

export interface IPactuacaoMapper extends IMapper<Pactuacao, PactuacaoDTO> {}

import { PactuacaoDTO } from "../../dto/PactuacaoDTO";
import { IAppMapper } from "../../../core/mapper/IAppMapper";
import { Pactuacao} from "../../../domain/ano/entities/Pactuacao";

export interface IPactuacaoAppMapper extends IAppMapper<Pactuacao, PactuacaoDTO> {}

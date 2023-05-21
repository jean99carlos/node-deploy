import { PactuacaoDTO } from "../../aplication/dto/PactuacaoDTO";
import { IAppService } from "../../core/appservices/IAppService";
import { Result } from "../../core/domain/Result";

export interface IPactuacaoAppService extends IAppService<PactuacaoDTO> {}

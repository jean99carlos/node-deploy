import { AnoDTO } from "../../dto/AnoDTO";
import { IAppMapper } from "../../../core/mapper/IAppMapper";
import { Ano } from "../../../domain/ano/entities/Ano";

export interface IAnoAppMapper extends IAppMapper<Ano, AnoDTO> {}

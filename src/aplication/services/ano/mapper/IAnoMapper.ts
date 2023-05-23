import { AnoDTO } from "../dtos/AnoDTO";
import { IMapper } from "../../../../core/mapper/IMapper";
import { Ano } from "../../../../domain/ano/entities/Ano";

export interface IAnoMapper extends IMapper<Ano, AnoDTO> {}

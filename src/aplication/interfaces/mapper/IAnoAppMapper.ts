import { Ano } from "@prisma/client";
import { AnoDTO } from "../../dto/AnoDTO";
import { IAppMapper } from "../../../core/mapper/IAppMapper";

export interface IAnoAppMapper extends IAppMapper<Ano, AnoDTO> {}

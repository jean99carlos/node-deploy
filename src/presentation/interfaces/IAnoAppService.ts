import { AnoDTO } from "../../aplication/dto/AnoDTO";

export interface IAnoAppService {
  get(): Promise<AnoDTO[] | undefined>;
}

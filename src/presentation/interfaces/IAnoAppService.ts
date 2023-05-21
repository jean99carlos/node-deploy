import { AnoDTO } from "../../aplication/dto/AnoDTO";
import { Result } from "../../core/domain/Result";

export interface IAnoAppService {
  get(): Promise<Result<AnoDTO[]>>;
  create(dto:AnoDTO): Promise<Result<AnoDTO>>;
}

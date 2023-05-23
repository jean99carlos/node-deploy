import { AnoDTO } from "../../../../aplication/services/ano/dtos/AnoDTO";
import { Result } from "../../../../core/domain/Result";

export interface IAnoAppService {
  get(): Promise<Result<AnoDTO[]>>;
  create(dto: AnoDTO): Promise<Result<AnoDTO>>;
  delete(id: string): Promise<Result<AnoDTO>>;
  getById(id?: string): Promise<Result<AnoDTO>>;
  update(dto: AnoDTO): Promise<Result<AnoDTO>>;
}

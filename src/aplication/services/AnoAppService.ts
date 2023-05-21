import { Result } from "../../core/domain/Result";
import { AnoAppMapper } from "../../infrastructure/crosscutting/adapter/mappers/aplication/AnoAppMapper";
import { IAnoAppService } from "../../presentation/interfaces/IAnoAppService";
import { AnoDTO } from "../dto/AnoDTO";
import { IAnoService } from "../interfaces/services/ano/IAnoService";

export class AnoAppService implements IAnoAppService {
  mapper: AnoAppMapper;
  constructor(private service: IAnoService) {
    this.mapper = AnoAppMapper.getInstance();
  }
  async get(): Promise<Result<AnoDTO[]>> {
    const results = await this.service.get();
    if (results.isFailure) {
      return Result.fail<AnoDTO[]>(results.error ?? "");
    }
    let dtos = results.getValue().map((x) => this.mapper.toDTO(x));
    if (dtos.some((x) => x.isFailure)) {
      return Result.fail("Fail to cast some register");
    }
    const dtosParse = dtos.map((x) => x.getValue());
    return Result.ok<AnoDTO[]>(dtosParse);
  }
  
  async create(dto: AnoDTO): Promise<Result<AnoDTO>> {
    const entity = this.mapper.toEntity(dto);
    if (entity.isFailure) {
      return Result.fail(entity.error ?? "");
    }
    const result = await this.service.create(entity.getValue());
    if (result.isFailure) {
      return Result.fail<AnoDTO>(result.error ?? "");
    }
    const obj = this.mapper.toDTO(result.getValue());
    if (obj.isFailure) {
      return Result.fail(obj.error ?? "");
    }
    return Result.ok<AnoDTO>(obj.getValue());
  }
}

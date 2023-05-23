import { Result } from "../../../../core/domain/Result";
import { AnoMapper } from "../../../../infrastructure/crosscutting/adapter/mappers/AnoMapper";
import { IAnoAppService } from "../../../../presentation/controllers/ano/interfaces/IAnoAppService";
import { AnoDTO } from "../dtos/AnoDTO";
import { IAnoService } from "../interfaces/services/IAnoService";

export class AnoAppService implements IAnoAppService {
  mapper: AnoMapper;
  constructor(private service: IAnoService) {
    this.mapper = AnoMapper.getInstance();
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
  async getById(id?: string): Promise<Result<AnoDTO>> {
    if (id == undefined) {
      return Result.fail("Id must be informed");
    }
    const result = await this.service.getById(id);
    if (result.isFailure) {
      return Result.fail<AnoDTO>(result.error ?? "");
    }
    const dto = this.mapper.toDTO(result.getValue());
    return dto;
  }

  async create(dto: AnoDTO): Promise<Result<AnoDTO>> {
    const entity = this.mapper.toDomain(dto);
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
  async delete(id: string): Promise<Result<AnoDTO>> {
    const result = await this.service.delete(id);
    if (result.isFailure) {
      return Result.fail(result.error ?? "");
    }
    return this.mapper.toDTO(result.getValue());
  }
  async update(dto: AnoDTO): Promise<Result<AnoDTO>> {
    const entity = this.mapper.toDomain(dto);
    if (entity.isFailure) {
      return Result.fail(entity.error ?? "");
    }
    const result = await this.service.update(entity.getValue());
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

import { Result } from "../../../core/domain/Result";
import { PactuacaoMapper } from "../../../infrastructure/crosscutting/adapter/mappers/PactuacaoMapper";
import { IPactuacaoAppService } from "../../../presentation/controllers/pactuacao/interfaces/IPactuacaoAppService";
import { PactuacaoDTO } from "./dtos/PactuacaoDTO";
import { IPactuacaoService } from "./interfaces/services/IPactuacaoService";

export class PactuacaoAppService implements IPactuacaoAppService {
  mapper: PactuacaoMapper;
  constructor(private service: IPactuacaoService) {
    this.mapper = PactuacaoMapper.getInstance();
  }

  async get(): Promise<Result<PactuacaoDTO[]>> {
    const results = await this.service.get();
    if (results.isFailure) {
      return Result.fail<PactuacaoDTO[]>(results.error ?? "");
    }
    let dtos = results.getValue().map((x) => this.mapper.toDTO(x));
    if (dtos.some((x) => x.isFailure)) {
      return Result.fail("Fail to cast some register");
    }
    const dtosParse = dtos.map((x) => x.getValue());
    return Result.ok<PactuacaoDTO[]>(dtosParse);
  }
  async getById(id?: string): Promise<Result<PactuacaoDTO>> {
    if (id == undefined) {
      return Result.fail("Id must be informed");
    }
    const result = await this.service.getById(id);
    if (result.isFailure) {
      return Result.fail<PactuacaoDTO>(result.error ?? "");
    }
    const dto = this.mapper.toDTO(result.getValue());
    return dto;
  }

  async create(dto: PactuacaoDTO): Promise<Result<PactuacaoDTO>> {
    const entity = this.mapper.toDomain(dto);
    if (entity.isFailure) {
      return Result.fail(entity.error ?? "");
    }
    const result = await this.service.create(entity.getValue());
    if (result.isFailure) {
      return Result.fail<PactuacaoDTO>(result.error ?? "");
    }
    const obj = this.mapper.toDTO(result.getValue());
    if (obj.isFailure) {
      return Result.fail(obj.error ?? "");
    }
    return Result.ok<PactuacaoDTO>(obj.getValue());
  }
  async delete(id: string): Promise<Result<PactuacaoDTO>> {
    const result = await this.service.delete(id);
    if (result.isFailure) {
      return Result.fail(result.error ?? "");
    }
    return this.mapper.toDTO(result.getValue());
  }
  async update(dto: PactuacaoDTO): Promise<Result<PactuacaoDTO>> {
    const entity = this.mapper.toDomain(dto);
    if (entity.isFailure) {
      return Result.fail(entity.error ?? "");
    }
    const result = await this.service.update(entity.getValue());
    if (result.isFailure) {
      return Result.fail<PactuacaoDTO>(result.error ?? "");
    }
    const obj = this.mapper.toDTO(result.getValue());
    if (obj.isFailure) {
      return Result.fail(obj.error ?? "");
    }
    return Result.ok<PactuacaoDTO>(obj.getValue());
  }
}

import { AnoAppMapper } from "../../infrastructure/crosscutting/adapter/mappers/aplication/AnoAppMapper";
import { IAnoAppService } from "../../presentation/interfaces/IAnoAppService";
import { AnoDTO } from "../dto/AnoDTO";
import { IAnoService } from "../interfaces/services/ano/IAnoService";

export class AnoAppService implements IAnoAppService{
  mapper: AnoAppMapper;
  constructor(private service: IAnoService) {
    this.mapper = AnoAppMapper.getInstance();
  }
  async get(): Promise<AnoDTO[]|undefined> {
    const results = await this.service.get();
    if(!results) return;
    const dtos =results.map((x) => this.mapper.toDTO(x));
    return dtos;
  }
}

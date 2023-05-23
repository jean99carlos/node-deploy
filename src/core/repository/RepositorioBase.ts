import { WithId } from "../domain/Entity";
import { Result } from "../domain/Result";
import { IDomainMapper } from "../mapper/IMapper";
import { IRepositorio } from "./IRepositorio";

export abstract class RepositorioBase<T extends WithId, F>
  implements IRepositorio<T>
{
  constructor(protected mapper: IDomainMapper<T, F>, protected model: any) {}

  async get(): Promise<Result<T[]>> {
    const resultsDTO = await this.model.findMany();
    const resultsDomain = resultsDTO.map((dto: any) =>
      this.mapper.toDomain(dto)
    );
    if (resultsDomain.some((x: any) => x.isFailure))
      return Result.fail("Fail to parse some");
    else return Result.ok(resultsDomain.map((x: any) => x.getValue()));
  }

  async create(param: T): Promise<Result<T>> {
    const parsedDTO = this.mapper.toPersistence(param);
    if (parsedDTO.isFailure) {
      return Result.fail(parsedDTO.error ?? "");
    }
    const createdDTO = await this.model.create({
      data: parsedDTO.getValue(),
    });
    const createdDomain = this.mapper.toDomain(createdDTO);
    return createdDomain;
  }

  async update(param: T): Promise<Result<T>> {
    const parsedDTO = this.mapper.toPersistence(param);
    const updatedDTO = await this.model.update({
      where: { id: param.id },
      data: parsedDTO.getValue(),
    });
    const updatedDomain = this.mapper.toDomain(updatedDTO);
    return updatedDomain;
  }

  async delete(param: T): Promise<Result<T>> {
    const result = await this.model.delete({
      where: { id: param.id },
    });
    return Result.ok(param);
  }

  async getById(id: string): Promise<Result<T>> {
    const parsedDTO = await this.model.findUnique({
      where: { id: id },
    });
    if (parsedDTO == null) {
      return Result.fail<T>("Not found");
    } else {
      return this.mapper.toDomain(parsedDTO);
    }
  }
}

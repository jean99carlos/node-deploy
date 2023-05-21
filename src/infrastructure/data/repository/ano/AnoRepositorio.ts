import { Ano } from "../../../../domain/ano/entities/Ano";
import { IAnoRepositorio } from "../../../../domain/ano/interfaces/repository/IAnoRepositorio";
import { PrismaContext } from "../../../../core/repository/PrismaContext";
import { AnoDomainMapper } from "../../../crosscutting/adapter/mappers/domain/AnoDomainMapper";
import { Result } from "../../../../core/domain/Result";
export class AnoRepositorio implements IAnoRepositorio {
  private prisma;
  private mapper;
  constructor() {
    this.prisma = PrismaContext.getInstance();
    this.mapper = AnoDomainMapper.getInstance();
  }

  async get(): Promise<Result<Ano[]>> {
    const anosDTO = await this.prisma.ano.findMany();
    const anos = anosDTO.map((anoDTO) => this.mapper.toDomain(anoDTO));
    if (anos.some((x) => x.isFailure)) return Result.fail("Fail to parse some");
    else return Result.ok(anos.map((x) => x.getValue()));
  }

  async create(param: Ano): Promise<Result<Ano>> {
    console.log(param)
    const anoDTO = this.mapper.toPersistence(param);
    if (anoDTO.isFailure) {
      return Result.fail<Ano>(anoDTO.error ?? "");
    }
    const createdAnoDTO = await this.prisma.ano.create({
      data: anoDTO.getValue(),
    });
    const createdAno = this.mapper.toDomain(createdAnoDTO);
    return createdAno;
  }

  async update(param: Ano): Promise<Result<Ano>> {
    const anoDTO = this.mapper.toPersistence(param);
    const updatedAnoDTO = await this.prisma.ano.update({
      where: { id: param.id },
      data: anoDTO.getValue(),
    });
    const updatedAno = this.mapper.toDomain(updatedAnoDTO);
    return updatedAno;
  }

  async delete(param: Ano): Promise<Result<void>> {
    const result = await this.prisma.ano.delete({
      where: { id: param.id },
    });
    return Result.ok();
  }

  async getById(id: string): Promise<Result<Ano>> {
    const anoDTO = await this.prisma.ano.findUnique({
      where: { id },
    });
    if (anoDTO == null) {
      return Result.fail<Ano>("Não encontrado");
    } else {
      return this.mapper.toDomain(anoDTO);
    }
  }
}

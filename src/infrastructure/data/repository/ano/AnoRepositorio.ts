import { Ano } from "../../../../domain/ano/entities/Ano";
import { IAnoRepositorio } from "../../../../domain/ano/interfaces/repository/IAnoRepositorio";
import { PrismaContext } from "../../../../core/repository/PrismaContext";
import { AnoDomainMapper } from "../../../crosscutting/adapter/mappers/domain/AnoDomainMapper";
export class AnoRepositorio implements IAnoRepositorio {
  private prisma;
  private mapper;
  constructor() {
    this.prisma = PrismaContext.getInstance();
    this.mapper = AnoDomainMapper.getInstance();
  }

  async get(): Promise<Ano[]> {
    const anosDTO = await this.prisma.ano.findMany();
    const anos = anosDTO.map((anoDTO) => this.mapper.toDomain(anoDTO));
    return anos;
  }

  async create(param: Ano): Promise<Ano> {
    const anoDTO = this.mapper.toPersistence(param);
    const createdAnoDTO = await this.prisma.ano.create({
      data: anoDTO,
    });
    const createdAno = this.mapper.toDomain(createdAnoDTO);
    return createdAno;
  }

  async update(param: Ano): Promise<Ano> {
    const anoDTO = this.mapper.toPersistence(param);
    const updatedAnoDTO = await this.prisma.ano.update({
      where: { id: param.id },
      data: anoDTO,
    });
    const updatedAno = this.mapper.toDomain(updatedAnoDTO);
    return updatedAno;
  }

  async delete(param: Ano): Promise<void> {
    await this.prisma.ano.delete({
      where: { id: param.id },
    });
  }

  async getById(id: string): Promise<Ano | undefined> {
    const anoDTO = await this.prisma.ano.findUnique({
      where: { id },
    });
    if (anoDTO) {
      const ano = this.mapper.toDomain(anoDTO);
      return ano;
    }
  }
}

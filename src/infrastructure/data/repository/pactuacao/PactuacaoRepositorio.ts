import { PrismaContext } from "../../../../core/repository/PrismaContext";
import { Result } from "../../../../core/domain/Result";
import { IPactuacaoRepositorio } from "../../../../domain/pactuacao/interfaces/repository/IPactuacaoRepositorio";
import { Pactuacao } from "../../../../domain/pactuacao/entities/Pactuacao";
import { PactuacaoDomainMapper } from "../../../crosscutting/adapter/mappers/domain/PactuacaoDomainMapper";
export class PactuacaoRepositorio implements IPactuacaoRepositorio {
  private prisma;
  private mapper;
  constructor() {
    this.prisma = PrismaContext.getInstance();
    this.mapper = PactuacaoDomainMapper.getInstance();
  }

  async get(): Promise<Result<Pactuacao[]>> {
    const registersDTO = await this.prisma.pactuacao.findMany();
    const registers = registersDTO.map((register) =>
      this.mapper.toDomain(register)
    );
    if (registers.some((x) => x.isFailure)) {
      return Result.fail("Fail to parse some");
    } else {
      return Result.ok(registers.map((x) => x.getValue()));
    }
  }

  async create(param: Pactuacao): Promise<Result<Pactuacao>> {
    const dto = this.mapper.toPersistence(param);
    if (dto.isFailure) {
      return Result.fail<Pactuacao>(dto.error ?? "");
    }
    const createdDTO = await this.prisma.pactuacao.create({
      data: dto.getValue(),
    });
    const created = this.mapper.toDomain(createdDTO);
    return created;
  }

  async update(param: Pactuacao): Promise<Result<Pactuacao>> {
    const dto = this.mapper.toPersistence(param);
    const updatedDTO = await this.prisma.pactuacao.update({
      where: { id: param.id },
      data: dto.getValue(),
    });
    const updated = this.mapper.toDomain(updatedDTO);
    return updated;
  }

  async delete(param: Pactuacao): Promise<Result<Pactuacao>> {
    const result = await this.prisma.pactuacao.delete({
      where: { id: param.id },
    });
    return Result.ok(param);
  }

  async getById(id: string): Promise<Result<Pactuacao>> {
    const dto = await this.prisma.pactuacao.findUnique({
      where: { id: id },
    });
    if (dto == null) {
      return Result.fail<Pactuacao>("Not found");
    } else {
      return this.mapper.toDomain(dto);
    }
  }
}

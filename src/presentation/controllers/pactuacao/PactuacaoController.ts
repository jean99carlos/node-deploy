import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { IPactuacaoAppService } from "./interfaces/IPactuacaoAppService";
import { IPactuacaoController } from "../../router/pactuacao/interfaces/IPactuacaoController";
import { PactuacaoDTO } from "../../../aplication/services/pactuacao/dtos/PactuacaoDTO";

const paramsSchema = z.object({
  id: z.string(),
});

export default class PactuacaoController implements IPactuacaoController {
  constructor(private service: IPactuacaoAppService) {}

  async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const dto = new PactuacaoDTO(request.body);
    const created = await this.service.create(dto);
    return reply.status(201).send(created);
  }

  async get(request: FastifyRequest): Promise<any> {
    return await this.service.get();
  }
  async getById(request: FastifyRequest): Promise<any> {
    const param = paramsSchema.parse(request.params);
    return await this.service.getById(param.id);
  }
  async delete(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const param = paramsSchema.parse(request.params);
    if (param.id == undefined) {
      return reply.status(500).send("Not found");
    }
    const result = await this.service.delete(param.id);
    if (result.isFailure) {
      return reply.status(201).send(result);
    }
    return reply.status(201).send(result);
  }
  async update(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const param = paramsSchema.parse(request.params);
    const anoDTO = new PactuacaoDTO(request.body);
    anoDTO.id = param.id;
    const created = await this.service.update(anoDTO);
    return reply.status(201).send(created);
  }
}

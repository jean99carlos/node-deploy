import { FastifyRequest, FastifyReply } from "fastify";
import { IAnoController } from "../../router/ano/interfaces/IAnoController";
import { IAnoAppService } from "./interfaces/IAnoAppService";
import { z } from "zod";
import { AnoDTO } from "../../../aplication/services/ano/dtos/AnoDTO";
const paramsSchema = z.object({
  id: z.string(),
});

export default class AnoController implements IAnoController {
  constructor(private service: IAnoAppService) {}

  async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const anoDTO = new AnoDTO(request.body);
    const created = await this.service.create(anoDTO);
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
    const anoDTO = new AnoDTO(request.body);
    anoDTO.id = param.id;
    const created = await this.service.update(anoDTO);
    return reply.status(201).send(created);
  }
}

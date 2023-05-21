import { FastifyRequest, FastifyReply } from "fastify";
import { IAnoController } from "../../router/interfaces/ano/IAnoController";
import { IAnoAppService } from "../../interfaces/IAnoAppService";
import { z } from "zod";
const createParamsSchema = z.object({
  id: z.string(),
});
const createAnoSchema = z.object({
  id: z.string().optional(),
  descricao: z.string(),
});
export default class AnoController implements IAnoController {
  constructor(private service: IAnoAppService) {}

  async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const anoDTO = createAnoSchema.parse(request.body);
    const created = await this.service.create(anoDTO);
    return reply.status(201).send(created);
  }

  async get(request: FastifyRequest): Promise<any> {
    return await this.service.get();
  }
  async getById(request: FastifyRequest): Promise<any> {
    const param = createParamsSchema.parse(request.params);
    return await this.service.getById(param.id);
  }
  async delete(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const param = createParamsSchema.parse(request.params);
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
    const param = createParamsSchema.parse(request.params);
    const anoDTO = createAnoSchema.parse(request.body);
    anoDTO.id=param.id;
    const created = await this.service.update(anoDTO);
    return reply.status(201).send(created);
  }
}

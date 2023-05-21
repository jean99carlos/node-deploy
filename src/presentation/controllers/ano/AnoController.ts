import { FastifyRequest, FastifyReply } from "fastify";
import { IAnoController } from "../../../core/controller/IAnoController";
import { IAnoAppService } from "../../interfaces/IAnoAppService";
import { z } from "zod";
import { AnoDTO } from "../../../aplication/dto/AnoDTO";

const createAnoSchema = z.object({
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
}

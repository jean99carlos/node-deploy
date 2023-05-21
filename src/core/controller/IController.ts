import { FastifyReply, FastifyRequest } from "fastify";

export interface IController<T> {
  get(request: FastifyRequest): Promise<FastifyReply>;
  create(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
}

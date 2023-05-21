import { FastifyReply, FastifyRequest } from "fastify";

export interface IController<T> {
  get(request: FastifyRequest): Promise<FastifyReply>;
  create(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
  delete(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
  getById(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
  update(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
}

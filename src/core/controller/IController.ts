import { FastifyReply, FastifyRequest } from "fastify";

export interface IController<T> {
  get(request: FastifyRequest): Promise<any>;
  create(request: FastifyRequest, reply: FastifyReply): void;
}

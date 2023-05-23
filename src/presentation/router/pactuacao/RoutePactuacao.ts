import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IPactuacaoController } from "./interfaces/IPactuacaoController";

export class RoutePactuacao {
  constructor(private controller: IPactuacaoController) {}
  public registerRoutes(app: FastifyInstance): void {
    app.post("/pactuacao", (request: FastifyRequest, reply: FastifyReply) => {
      this.controller.create(request, reply);
    });

    app.get("/pactuacao", async (request: FastifyRequest) => {
      return await this.controller.get(request);
    });
    app.get(
      "/pactuacao/:id",
      async (request: FastifyRequest, reply: FastifyReply) => {
        return await this.controller.getById(request, reply);
      }
    );
    app.delete(
      "/pactuacao/:id",
      async (request: FastifyRequest, reply: FastifyReply) => {
        return await this.controller.delete(request, reply);
      }
    );
    app.put(
      "/pactuacao/:id",
      async (request: FastifyRequest, reply: FastifyReply) => {
        return await this.controller.update(request, reply);
      }
    );
  }
}

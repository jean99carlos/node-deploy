import { IAnoController } from "./interfaces/ano/IAnoController";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export class RouteAno {
  constructor(private controller: IAnoController) {}
  public registerRoutes(app: FastifyInstance): void {
    app.post("/ano", (request: FastifyRequest, reply: FastifyReply) => {
      this.controller.create(request, reply);
    });

    app.get("/ano", async (request: FastifyRequest) => {
      return await this.controller.get(request);
    });
    app.get(
      "/ano/:id",
      async (request: FastifyRequest, reply: FastifyReply) => {
        return await this.controller.getById(request, reply);
      }
    );
    app.delete(
      "/ano/:id",
      async (request: FastifyRequest, reply: FastifyReply) => {
        return await this.controller.delete(request, reply);
      }
    );
    app.put(
      "/ano/:id",
      async (request: FastifyRequest, reply: FastifyReply) => {
        return await this.controller.update(request, reply);
      }
    );
  }
}

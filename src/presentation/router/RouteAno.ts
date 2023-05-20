import { IAnoController } from "../../core/controller/IAnoController";
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
  }
}

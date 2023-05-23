import { IAnoController } from "./interfaces/IAnoController";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export class RouteAno {
  private route;
  constructor(private controller: IAnoController) {
    this.route = "ano";
  }

  public registerRoutes(app: FastifyInstance): void {
    app.post(
      `/${this.route}`,
      async (request: FastifyRequest, reply: FastifyReply) => {
        await this.controller.create(request, reply);
      }
    );

    app.get(`/${this.route}`, async (request: FastifyRequest) => {
      return this.controller.get(request);
    });

    app.get(
      `/${this.route}/:id`,
      async (request: FastifyRequest, reply: FastifyReply) => {
        return this.controller.getById(request, reply);
      }
    );

    app.delete(
      `/${this.route}/:id`,
      async (request: FastifyRequest, reply: FastifyReply) => {
        return this.controller.delete(request, reply);
      }
    );

    app.put(
      `/${this.route}/:id`,
      async (request: FastifyRequest, reply: FastifyReply) => {
        return this.controller.update(request, reply);
      }
    );
  }
}

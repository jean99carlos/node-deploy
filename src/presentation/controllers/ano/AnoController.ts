import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IAnoController } from "../../../core/controller/IAnoController";
import { IAnoAppService } from "../../interfaces/IAnoAppService";
export default class AnoController implements IAnoController {
  constructor(
    private service: IAnoAppService
  ) {}

  public  registerRoutes(app: FastifyInstance): void {
    app.post("/ano", (request: FastifyRequest, reply: FastifyReply) => {
      this.create(request, reply);
    });

    app.get("/ano", async (request: FastifyRequest) => {
      const anos = await this.get(request);
      return anos;
    });
  }

  create(request: FastifyRequest, reply: FastifyReply): void {
    // Implement the create method logic here
  }

  async get(request: FastifyRequest): Promise<any> {
    const anos = await this.service.get();
    return anos;
  }
}

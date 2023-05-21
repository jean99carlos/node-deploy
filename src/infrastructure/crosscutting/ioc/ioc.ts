import { FastifyInstance } from "fastify";
import { AnoRepositorio } from "../../data/repository/ano/AnoRepositorio";
import { AnoService } from "../../../domain/ano/services/AnoService";
import AnoController from "../../../presentation/controllers/ano/AnoController";
import { AnoAppService } from "../../../aplication/services/ano/AnoAppService";
import { RouteAno } from "../../../presentation/router/routes/ano/RouteAno";
import { PactuacaoRepositorio } from "../../data/repository/pactuacao/PactuacaoRepositorio";
import { PactuacaoService } from "../../../domain/pactuacao/services/PactuacaoService";
import { PactuacaoAppService } from "../../../aplication/services/pactuacao/PactuacaoAppService";
import { RoutePactuacao } from "../../../presentation/router/routes/pactuacao/RoutePactuacao";
import PactuacaoController from "../../../presentation/controllers/pactuacao/PactuacaoController";

export class IOC {
  static ano(app: FastifyInstance) {
    const repository = new AnoRepositorio();
    const service = new AnoService(repository);
    const appService = new AnoAppService(service);
    const controller = new AnoController(appService);
    const route = new RouteAno(controller);
    route.registerRoutes(app);
  }
  static pactuacao = (app: FastifyInstance) => {
    const repository = new PactuacaoRepositorio();
    const service = new PactuacaoService(repository);
    const appService = new PactuacaoAppService(service);
    const controller = new PactuacaoController(appService);
    const route = new RoutePactuacao(controller);
    route.registerRoutes(app);
  };
  static execute(app: FastifyInstance) {
    this.ano(app);
    this.pactuacao(app);
  }
}

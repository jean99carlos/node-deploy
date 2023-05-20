import { FastifyInstance } from "fastify";
import { AnoRepositorio } from "../../data/repository/ano/AnoRepositorio";
import { AnoService } from "../../../domain/ano/services/AnoService";
import AnoController from "../../../presentation/controllers/ano/AnoController";
import { AnoAppService } from "../../../aplication/services/AnoAppService";
import { RouteAno } from "../../../presentation/router/RouteAno";

export class IOC {
    static execute(app:FastifyInstance){
        var anoRepositorio = new AnoRepositorio();
        var anoService = new AnoService(anoRepositorio);
        var anoAppService = new AnoAppService(anoService);
        var anoController = new AnoController(anoAppService);
        var routeAno = new RouteAno(anoController);
        routeAno.registerRoutes(app);
    }
};

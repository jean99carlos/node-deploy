"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/infrastructure/ioc/ioc.ts
var ioc_exports = {};
__export(ioc_exports, {
  IOC: () => IOC
});
module.exports = __toCommonJS(ioc_exports);

// src/core/repository/PrismaContext.ts
var import_client = require("@prisma/client");
var _PrismaContext = class {
  constructor() {
  }
  static getInstance() {
    if (!_PrismaContext.context) {
      _PrismaContext.context = new import_client.PrismaClient();
    }
    return _PrismaContext.context;
  }
};
var PrismaContext = _PrismaContext;
__name(PrismaContext, "PrismaContext");
__publicField(PrismaContext, "context");

// src/core/domain/Entity.ts
var Entity = class {
  constructor(props, id) {
    __publicField(this, "id");
    __publicField(this, "props");
    this.props = props;
    this.id = id ?? crypto.randomUUID();
  }
};
__name(Entity, "Entity");

// src/domain/ano/entities/Ano.ts
var Ano = class extends Entity {
  constructor(props, id) {
    super(props, id);
  }
  static create(props, id) {
    const ano = new Ano(props, id);
    return ano;
  }
};
__name(Ano, "Ano");

// src/core/domain/mappers/MapperAno.ts
var MapperAno = class {
  static toDomain(raw) {
    return Ano.create({
      descricao: raw.descricao
    }, raw.id ?? void 0);
  }
  static toPersistence(ano) {
    return {
      id: ano.id,
      descricao: ano.props.descricao
    };
  }
};
__name(MapperAno, "MapperAno");

// src/infrastructure/repository/ano/AnoRepositorio.ts
var AnoRepositorio = class {
  constructor() {
    __publicField(this, "prisma");
    this.prisma = PrismaContext.getInstance();
  }
  async get() {
    console.log("repo");
    const anosDTO = await this.prisma.ano.findMany();
    const anos = anosDTO.map((anoDTO) => MapperAno.toDomain(anoDTO));
    return anos;
  }
  async create(param) {
    const anoDTO = MapperAno.toPersistence(param);
    const createdAnoDTO = await this.prisma.ano.create({
      data: anoDTO
    });
    const createdAno = MapperAno.toDomain(createdAnoDTO);
    return createdAno;
  }
  async update(param) {
    const anoDTO = MapperAno.toPersistence(param);
    const updatedAnoDTO = await this.prisma.ano.update({
      where: {
        id: param.id
      },
      data: anoDTO
    });
    const updatedAno = MapperAno.toDomain(updatedAnoDTO);
    return updatedAno;
  }
  async delete(param) {
    await this.prisma.ano.delete({
      where: {
        id: param.id
      }
    });
  }
  async getById(id) {
    const anoDTO = await this.prisma.ano.findUnique({
      where: {
        id
      }
    });
    if (anoDTO) {
      const ano = MapperAno.toDomain(anoDTO);
      return ano;
    }
  }
};
__name(AnoRepositorio, "AnoRepositorio");

// src/aplication/services/ano/AnoService.ts
var AnoService = class {
  constructor(repo) {
    __publicField(this, "repo");
    this.repo = repo;
    if (!this.repo)
      throw new Error("Repository must be a valid implementation");
  }
  get() {
    return this.repo.get();
  }
  getById() {
    throw new Error("Method not implemented.");
  }
  create(param) {
    throw new Error("Method not implemented.");
  }
  update(param) {
    throw new Error("Method not implemented.");
  }
  delete(param) {
    throw new Error("Method not implemented.");
  }
};
__name(AnoService, "AnoService");

// src/presentation/controllers/ano/AnoController.ts
var AnoController = class {
  constructor(service) {
    __publicField(this, "service");
    this.service = service;
  }
  registerRoutes(app) {
    app.post("/ano", (request, reply) => {
      this.create(request, reply);
    });
    app.get("/ano", async (request) => {
      const anos = await this.get(request);
      return anos;
    });
  }
  create(request, reply) {
  }
  async get(request) {
    const anos = await this.service.get();
    return anos;
  }
};
__name(AnoController, "AnoController");

// src/infrastructure/ioc/ioc.ts
var IOC = class {
  static execute(app) {
    var anoRepositorio = new AnoRepositorio();
    var anoService = new AnoService(anoRepositorio);
    var anoController = new AnoController(anoService);
    anoController.registerRoutes(app);
  }
};
__name(IOC, "IOC");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IOC
});

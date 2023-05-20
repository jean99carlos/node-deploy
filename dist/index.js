"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/server.ts
var import_fastify = __toESM(require("fastify"));

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

// src/infrastructure/crosscutting/adapter/mappers/domain/AnoDomainMapper.ts
var _AnoDomainMapper = class {
  constructor() {
  }
  static getInstance() {
    if (!_AnoDomainMapper.instance) {
      _AnoDomainMapper.instance = new _AnoDomainMapper();
    }
    return _AnoDomainMapper.instance;
  }
  toDomain(raw) {
    return Ano.create({
      descricao: raw.descricao
    }, raw.id ?? void 0);
  }
  toPersistence(ano) {
    return {
      id: ano.id,
      descricao: ano.props.descricao
    };
  }
};
var AnoDomainMapper = _AnoDomainMapper;
__name(AnoDomainMapper, "AnoDomainMapper");
__publicField(AnoDomainMapper, "instance");

// src/infrastructure/data/repository/ano/AnoRepositorio.ts
var AnoRepositorio = class {
  constructor() {
    __publicField(this, "prisma");
    __publicField(this, "mapper");
    this.prisma = PrismaContext.getInstance();
    this.mapper = AnoDomainMapper.getInstance();
  }
  async get() {
    const anosDTO = await this.prisma.ano.findMany();
    const anos = anosDTO.map((anoDTO) => this.mapper.toDomain(anoDTO));
    return anos;
  }
  async create(param) {
    const anoDTO = this.mapper.toPersistence(param);
    const createdAnoDTO = await this.prisma.ano.create({
      data: anoDTO
    });
    const createdAno = this.mapper.toDomain(createdAnoDTO);
    return createdAno;
  }
  async update(param) {
    const anoDTO = this.mapper.toPersistence(param);
    const updatedAnoDTO = await this.prisma.ano.update({
      where: {
        id: param.id
      },
      data: anoDTO
    });
    const updatedAno = this.mapper.toDomain(updatedAnoDTO);
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
      const ano = this.mapper.toDomain(anoDTO);
      return ano;
    }
  }
};
__name(AnoRepositorio, "AnoRepositorio");

// src/domain/ano/services/AnoService.ts
var AnoService = class {
  constructor(repo) {
    __publicField(this, "repo");
    this.repo = repo;
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

// src/infrastructure/crosscutting/adapter/mappers/aplication/AnoAppMapper.ts
var _AnoAppMapper = class {
  constructor() {
  }
  static getInstance() {
    if (!_AnoAppMapper.instance) {
      _AnoAppMapper.instance = new _AnoAppMapper();
    }
    return _AnoAppMapper.instance;
  }
  toEntity(raw) {
    return Ano.create({
      descricao: raw.descricao
    }, raw.id ?? void 0);
  }
  toDTO(ano) {
    return {
      id: ano.id,
      descricao: ano.props.descricao
    };
  }
};
var AnoAppMapper = _AnoAppMapper;
__name(AnoAppMapper, "AnoAppMapper");
__publicField(AnoAppMapper, "instance");

// src/aplication/services/AnoAppService.ts
var AnoAppService = class {
  constructor(service) {
    __publicField(this, "service");
    __publicField(this, "mapper");
    this.service = service;
    this.mapper = AnoAppMapper.getInstance();
  }
  async get() {
    const results = await this.service.get();
    if (!results)
      return;
    const dtos = results.map((x) => this.mapper.toDTO(x));
    return dtos;
  }
};
__name(AnoAppService, "AnoAppService");

// src/infrastructure/crosscutting/ioc/ioc.ts
var IOC = class {
  static execute(app) {
    var anoRepositorio = new AnoRepositorio();
    var anoService = new AnoService(anoRepositorio);
    var anoAppService = new AnoAppService(anoService);
    var anoController = new AnoController(anoAppService);
    anoController.registerRoutes(app);
  }
};
__name(IOC, "IOC");

// src/server.ts
var server_default = /* @__PURE__ */ __name(() => {
  const app = (0, import_fastify.default)();
  IOC.execute(app);
  app.listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333
  }).then(() => {
    console.log("HTTP Server Running on port " + (process.env.PORT ? Number(process.env.PORT) : 3333).toString());
  });
}, "default");

// src/index.ts
server_default();

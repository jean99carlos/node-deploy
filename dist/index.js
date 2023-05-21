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
var import_crypto = __toESM(require("crypto"));
var Entity = class {
  constructor(props, id) {
    __publicField(this, "id");
    __publicField(this, "props");
    this.props = props;
    this.id = id ?? import_crypto.default.randomUUID();
  }
};
__name(Entity, "Entity");

// src/core/domain/Result.ts
var Result = class {
  constructor(isSuccess, error, value) {
    __publicField(this, "isSuccess");
    __publicField(this, "isFailure");
    __publicField(this, "error");
    __publicField(this, "_value");
    if (isSuccess && error) {
      throw new Error(`InvalidOperation: A result cannot be 
          successful and contain an error`);
    }
    if (!isSuccess && !error) {
      throw new Error(`InvalidOperation: A failing result 
          needs to contain an error message`);
    }
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;
    Object.freeze(this);
  }
  getValue() {
    if (!this.isSuccess || this._value == void 0) {
      throw new Error(`Cant retrieve the value from a failed result.`);
    }
    return this._value;
  }
  static ok(value) {
    return new Result(true, void 0, value);
  }
  static fail(error) {
    return new Result(false, error);
  }
  static combine(results) {
    for (let result of results) {
      if (result.isFailure)
        return result;
    }
    return Result.ok();
  }
};
__name(Result, "Result");

// src/domain/ano/entities/Ano.ts
var Ano = class extends Entity {
  constructor(props, id) {
    super(props, id);
  }
  static create(props, id) {
    try {
      Number.parseInt(props.descricao);
    } catch (ex) {
      return Result.fail("Descri\xE7\xE3o deve ser n\xFAmero");
    }
    if (props.descricao.length != 4) {
      return Result.fail("Ano deve ter 4 d\xEDgitos");
    }
    const ano = new Ano(props, id);
    return Result.ok(ano);
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
    const result = Ano.create({
      descricao: raw.descricao
    }, raw.id ?? void 0);
    return result;
  }
  toPersistence(ano) {
    try {
      return Result.ok({
        id: ano.id,
        descricao: ano.props.descricao
      });
    } catch (error) {
      console.log(error);
      return Result.fail("Fail to parse to persistence format");
    }
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
    if (anos.some((x) => x.isFailure))
      return Result.fail("Fail to parse some");
    else
      return Result.ok(anos.map((x) => x.getValue()));
  }
  async create(param) {
    console.log(param);
    const anoDTO = this.mapper.toPersistence(param);
    if (anoDTO.isFailure) {
      return Result.fail(anoDTO.error ?? "");
    }
    const createdAnoDTO = await this.prisma.ano.create({
      data: anoDTO.getValue()
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
      data: anoDTO.getValue()
    });
    const updatedAno = this.mapper.toDomain(updatedAnoDTO);
    return updatedAno;
  }
  async delete(param) {
    const result = await this.prisma.ano.delete({
      where: {
        id: param.id
      }
    });
    return Result.ok();
  }
  async getById(id) {
    const anoDTO = await this.prisma.ano.findUnique({
      where: {
        id
      }
    });
    if (anoDTO == null) {
      return Result.fail("N\xE3o encontrado");
    } else {
      return this.mapper.toDomain(anoDTO);
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
  getById(id) {
    return this.repo.getById(id);
  }
  create(param) {
    return this.repo.create(param);
  }
  update(param) {
    return this.repo.update(param);
  }
  delete(param) {
    return this.repo.delete(param);
  }
};
__name(AnoService, "AnoService");

// src/presentation/controllers/ano/AnoController.ts
var import_zod = require("zod");
var createAnoSchema = import_zod.z.object({
  descricao: import_zod.z.string()
});
var AnoController = class {
  constructor(service) {
    __publicField(this, "service");
    this.service = service;
  }
  async create(request, reply) {
    const anoDTO = createAnoSchema.parse(request.body);
    const created = await this.service.create(anoDTO);
    return reply.status(201).send(created);
  }
  async get(request) {
    return await this.service.get();
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
    }, raw.id);
  }
  toDTO(ano) {
    return Result.ok({
      id: ano.id,
      descricao: ano.props.descricao
    });
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
    if (results.isFailure) {
      return Result.fail(results.error ?? "");
    }
    let dtos = results.getValue().map((x) => this.mapper.toDTO(x));
    if (dtos.some((x) => x.isFailure)) {
      return Result.fail("Fail to cast some register");
    }
    const dtosParse = dtos.map((x) => x.getValue());
    return Result.ok(dtosParse);
  }
  async create(dto) {
    const entity = this.mapper.toEntity(dto);
    if (entity.isFailure) {
      return Result.fail(entity.error ?? "");
    }
    const result = await this.service.create(entity.getValue());
    if (result.isFailure) {
      return Result.fail(result.error ?? "");
    }
    const obj = this.mapper.toDTO(result.getValue());
    if (obj.isFailure) {
      return Result.fail(obj.error ?? "");
    }
    return Result.ok(obj.getValue());
  }
};
__name(AnoAppService, "AnoAppService");

// src/presentation/router/RouteAno.ts
var RouteAno = class {
  constructor(controller) {
    __publicField(this, "controller");
    this.controller = controller;
  }
  registerRoutes(app) {
    app.post("/ano", (request, reply) => {
      this.controller.create(request, reply);
    });
    app.get("/ano", async (request) => {
      return await this.controller.get(request);
    });
  }
};
__name(RouteAno, "RouteAno");

// src/infrastructure/crosscutting/ioc/ioc.ts
var IOC = class {
  static execute(app) {
    var anoRepositorio = new AnoRepositorio();
    var anoService = new AnoService(anoRepositorio);
    var anoAppService = new AnoAppService(anoService);
    var anoController = new AnoController(anoAppService);
    var routeAno = new RouteAno(anoController);
    routeAno.registerRoutes(app);
  }
};
__name(IOC, "IOC");

// src/server.ts
var server_default = /* @__PURE__ */ __name(() => {
  const app = (0, import_fastify.default)({
    logger: true,
    connectionTimeout: 5e3
  });
  app.addHook("onSend", async (request, reply, payload) => {
    if (payload instanceof Error && payload.constructor.name === "DomainError") {
      app.log.error(payload);
      console.error("ERROR HANDLER CALLED");
      console.error("Unhandled Rejection:", payload);
      reply.code(500).send({
        error: "Internal Server Error"
      });
      return false;
    }
    return payload;
  });
  IOC.execute(app);
  app.listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333
  }, function(err, address) {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
  console.log("HTTP Server Running on port " + (process.env.PORT ? Number(process.env.PORT) : 3333).toString());
}, "default");

// src/index.ts
server_default();

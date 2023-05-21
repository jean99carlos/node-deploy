"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/infrastructure/crosscutting/ioc/ioc.ts
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
    return Result.ok(param);
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
  async get() {
    return this.repo.get();
  }
  async getById(id) {
    return this.repo.getById(id);
  }
  async create(param) {
    return this.repo.create(param);
  }
  async update(param) {
    return this.repo.update(param);
  }
  async delete(id) {
    const register = await this.getById(id);
    if (register.isFailure) {
      return Result.fail(register.error ?? "");
    }
    return this.repo.delete(register.getValue());
  }
};
__name(AnoService, "AnoService");

// src/presentation/controllers/ano/AnoController.ts
var import_zod = require("zod");
var createParamsSchema = import_zod.z.object({
  id: import_zod.z.string()
});
var createAnoSchema = import_zod.z.object({
  id: import_zod.z.string().optional(),
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
  async getById(request) {
    const param = createParamsSchema.parse(request.params);
    return await this.service.getById(param.id);
  }
  async delete(request, reply) {
    const param = createParamsSchema.parse(request.params);
    if (param.id == void 0) {
      return reply.status(500).send("Not found");
    }
    const result = await this.service.delete(param.id);
    if (result.isFailure) {
      return reply.status(201).send(result);
    }
    return reply.status(201).send(result);
  }
  async update(request, reply) {
    const param = createParamsSchema.parse(request.params);
    const anoDTO = createAnoSchema.parse(request.body);
    anoDTO.id = param.id;
    const created = await this.service.update(anoDTO);
    return reply.status(201).send(created);
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

// src/aplication/services/ano/AnoAppService.ts
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
  async getById(id) {
    if (id == void 0) {
      return Result.fail("Id must be informed");
    }
    const result = await this.service.getById(id);
    if (result.isFailure) {
      return Result.fail(result.error ?? "");
    }
    const dto = this.mapper.toDTO(result.getValue());
    return dto;
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
  async delete(id) {
    const result = await this.service.delete(id);
    if (result.isFailure) {
      return Result.fail(result.error ?? "");
    }
    return this.mapper.toDTO(result.getValue());
  }
  async update(dto) {
    const entity = this.mapper.toEntity(dto);
    if (entity.isFailure) {
      return Result.fail(entity.error ?? "");
    }
    const result = await this.service.update(entity.getValue());
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

// src/presentation/router/routes/ano/RouteAno.ts
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
    app.get("/ano/:id", async (request, reply) => {
      return await this.controller.getById(request, reply);
    });
    app.delete("/ano/:id", async (request, reply) => {
      return await this.controller.delete(request, reply);
    });
    app.put("/ano/:id", async (request, reply) => {
      return await this.controller.update(request, reply);
    });
  }
};
__name(RouteAno, "RouteAno");

// src/domain/pactuacao/entities/Pactuacao.ts
var Pactuacao = class extends Entity {
  constructor(props, id) {
    super(props, id);
  }
  static create(props, id) {
    if (props.descricao.length == 0) {
      return Result.fail("Descri\xE7\xE3o n\xE3o deve ser vazia");
    }
    const pactuacao = new Pactuacao(props, id);
    return Result.ok(pactuacao);
  }
};
__name(Pactuacao, "Pactuacao");

// src/infrastructure/crosscutting/adapter/mappers/domain/PactuacaoDomainMapper.ts
var _PactuacaoDomainMapper = class {
  constructor() {
  }
  static getInstance() {
    if (!_PactuacaoDomainMapper.instance) {
      _PactuacaoDomainMapper.instance = new _PactuacaoDomainMapper();
    }
    return _PactuacaoDomainMapper.instance;
  }
  toDomain(raw) {
    const result = Pactuacao.create({
      descricao: raw.descricao,
      programa: raw.programa
    }, raw.id ?? void 0);
    return result;
  }
  toPersistence(object) {
    try {
      return Result.ok({
        id: object.id,
        descricao: object.props.descricao,
        programa: object.props.programa
      });
    } catch (error) {
      console.log(error);
      return Result.fail("Fail to parse to persistence format");
    }
  }
};
var PactuacaoDomainMapper = _PactuacaoDomainMapper;
__name(PactuacaoDomainMapper, "PactuacaoDomainMapper");
__publicField(PactuacaoDomainMapper, "instance");

// src/infrastructure/data/repository/pactuacao/PactuacaoRepositorio.ts
var PactuacaoRepositorio = class {
  constructor() {
    __publicField(this, "prisma");
    __publicField(this, "mapper");
    this.prisma = PrismaContext.getInstance();
    this.mapper = PactuacaoDomainMapper.getInstance();
  }
  async get() {
    const registersDTO = await this.prisma.pactuacao.findMany();
    const registers = registersDTO.map((register) => this.mapper.toDomain(register));
    if (registers.some((x) => x.isFailure)) {
      return Result.fail("Fail to parse some");
    } else {
      return Result.ok(registers.map((x) => x.getValue()));
    }
  }
  async create(param) {
    const dto = this.mapper.toPersistence(param);
    if (dto.isFailure) {
      return Result.fail(dto.error ?? "");
    }
    const createdDTO = await this.prisma.pactuacao.create({
      data: dto.getValue()
    });
    const created = this.mapper.toDomain(createdDTO);
    return created;
  }
  async update(param) {
    const dto = this.mapper.toPersistence(param);
    const updatedDTO = await this.prisma.pactuacao.update({
      where: {
        id: param.id
      },
      data: dto.getValue()
    });
    const updated = this.mapper.toDomain(updatedDTO);
    return updated;
  }
  async delete(param) {
    const result = await this.prisma.pactuacao.delete({
      where: {
        id: param.id
      }
    });
    return Result.ok(param);
  }
  async getById(id) {
    const dto = await this.prisma.pactuacao.findUnique({
      where: {
        id
      }
    });
    if (dto == null) {
      return Result.fail("Not found");
    } else {
      return this.mapper.toDomain(dto);
    }
  }
};
__name(PactuacaoRepositorio, "PactuacaoRepositorio");

// src/domain/pactuacao/services/PactuacaoService.ts
var PactuacaoService = class {
  constructor(repo) {
    __publicField(this, "repo");
    this.repo = repo;
  }
  async get() {
    return this.repo.get();
  }
  async getById(id) {
    return this.repo.getById(id);
  }
  async create(param) {
    return this.repo.create(param);
  }
  async update(param) {
    return this.repo.update(param);
  }
  async delete(id) {
    const register = await this.getById(id);
    if (register.isFailure) {
      return Result.fail(register.error ?? "");
    }
    return this.repo.delete(register.getValue());
  }
};
__name(PactuacaoService, "PactuacaoService");

// src/infrastructure/crosscutting/adapter/mappers/aplication/PactuacaoAppMapper.ts
var _PactuacaoAppMapper = class {
  constructor() {
  }
  static getInstance() {
    if (!_PactuacaoAppMapper.instance) {
      _PactuacaoAppMapper.instance = new _PactuacaoAppMapper();
    }
    return _PactuacaoAppMapper.instance;
  }
  toEntity(raw) {
    return Pactuacao.create({
      descricao: raw.descricao,
      programa: raw.programa
    }, raw.id);
  }
  toDTO(dto) {
    return Result.ok({
      id: dto.id,
      descricao: dto.props.descricao,
      programa: dto.props.programa
    });
  }
};
var PactuacaoAppMapper = _PactuacaoAppMapper;
__name(PactuacaoAppMapper, "PactuacaoAppMapper");
__publicField(PactuacaoAppMapper, "instance");

// src/aplication/services/pactuacao/PactuacaoAppService.ts
var PactuacaoAppService = class {
  constructor(service) {
    __publicField(this, "service");
    __publicField(this, "mapper");
    this.service = service;
    this.mapper = PactuacaoAppMapper.getInstance();
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
  async getById(id) {
    if (id == void 0) {
      return Result.fail("Id must be informed");
    }
    const result = await this.service.getById(id);
    if (result.isFailure) {
      return Result.fail(result.error ?? "");
    }
    const dto = this.mapper.toDTO(result.getValue());
    return dto;
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
  async delete(id) {
    const result = await this.service.delete(id);
    if (result.isFailure) {
      return Result.fail(result.error ?? "");
    }
    return this.mapper.toDTO(result.getValue());
  }
  async update(dto) {
    const entity = this.mapper.toEntity(dto);
    if (entity.isFailure) {
      return Result.fail(entity.error ?? "");
    }
    const result = await this.service.update(entity.getValue());
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
__name(PactuacaoAppService, "PactuacaoAppService");

// src/presentation/router/routes/pactuacao/RoutePactuacao.ts
var RoutePactuacao = class {
  constructor(controller) {
    __publicField(this, "controller");
    this.controller = controller;
  }
  registerRoutes(app) {
    app.post("/pactuacao", (request, reply) => {
      this.controller.create(request, reply);
    });
    app.get("/pactuacao", async (request) => {
      return await this.controller.get(request);
    });
    app.get("/pactuacao/:id", async (request, reply) => {
      return await this.controller.getById(request, reply);
    });
    app.delete("/pactuacao/:id", async (request, reply) => {
      return await this.controller.delete(request, reply);
    });
    app.put("/pactuacao/:id", async (request, reply) => {
      return await this.controller.update(request, reply);
    });
  }
};
__name(RoutePactuacao, "RoutePactuacao");

// src/presentation/controllers/pactuacao/PactuacaoController.ts
var import_zod2 = require("zod");
var createParamsSchema2 = import_zod2.z.object({
  id: import_zod2.z.string()
});
var createPactuacaoSchema = import_zod2.z.object({
  id: import_zod2.z.string().optional(),
  descricao: import_zod2.z.string(),
  programa: import_zod2.z.string()
});
var PactuacaoController = class {
  constructor(service) {
    __publicField(this, "service");
    this.service = service;
  }
  async create(request, reply) {
    const dto = createPactuacaoSchema.parse(request.body);
    const created = await this.service.create(dto);
    return reply.status(201).send(created);
  }
  async get(request) {
    return await this.service.get();
  }
  async getById(request) {
    const param = createParamsSchema2.parse(request.params);
    return await this.service.getById(param.id);
  }
  async delete(request, reply) {
    const param = createParamsSchema2.parse(request.params);
    if (param.id == void 0) {
      return reply.status(500).send("Not found");
    }
    const result = await this.service.delete(param.id);
    if (result.isFailure) {
      return reply.status(201).send(result);
    }
    return reply.status(201).send(result);
  }
  async update(request, reply) {
    const param = createParamsSchema2.parse(request.params);
    const anoDTO = createPactuacaoSchema.parse(request.body);
    anoDTO.id = param.id;
    const created = await this.service.update(anoDTO);
    return reply.status(201).send(created);
  }
};
__name(PactuacaoController, "PactuacaoController");

// src/infrastructure/crosscutting/ioc/ioc.ts
var IOC = class {
  static ano(app) {
    const repository = new AnoRepositorio();
    const service = new AnoService(repository);
    const appService = new AnoAppService(service);
    const controller = new AnoController(appService);
    const route = new RouteAno(controller);
    route.registerRoutes(app);
  }
  static execute(app) {
    this.ano(app);
    this.pactuacao(app);
  }
};
__name(IOC, "IOC");
__publicField(IOC, "pactuacao", /* @__PURE__ */ __name((app) => {
  const repository = new PactuacaoRepositorio();
  const service = new PactuacaoService(repository);
  const appService = new PactuacaoAppService(service);
  const controller = new PactuacaoController(appService);
  const route = new RoutePactuacao(controller);
  route.registerRoutes(app);
}, "pactuacao"));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IOC
});

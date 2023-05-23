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

// src/infrastructure/crosscutting/adapter/mappers/AnoMapper.ts
var _AnoMapper = class {
  constructor() {
  }
  static getInstance() {
    if (!_AnoMapper.instance) {
      _AnoMapper.instance = new _AnoMapper();
    }
    return _AnoMapper.instance;
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
  toDTO(ano) {
    return Result.ok({
      id: ano.id,
      descricao: ano.props.descricao
    });
  }
};
var AnoMapper = _AnoMapper;
__name(AnoMapper, "AnoMapper");
__publicField(AnoMapper, "instance");

// src/core/repository/RepositorioBase.ts
var RepositorioBase = class {
  constructor(mapper, model) {
    __publicField(this, "mapper");
    __publicField(this, "model");
    this.mapper = mapper;
    this.model = model;
  }
  async get() {
    const resultsDTO = await this.model.findMany();
    const resultsDomain = resultsDTO.map((dto) => this.mapper.toDomain(dto));
    if (resultsDomain.some((x) => x.isFailure))
      return Result.fail("Fail to parse some");
    else
      return Result.ok(resultsDomain.map((x) => x.getValue()));
  }
  async create(param) {
    const parsedDTO = this.mapper.toPersistence(param);
    if (parsedDTO.isFailure) {
      return Result.fail(parsedDTO.error ?? "");
    }
    const createdDTO = await this.model.create({
      data: parsedDTO.getValue()
    });
    const createdDomain = this.mapper.toDomain(createdDTO);
    return createdDomain;
  }
  async update(param) {
    const parsedDTO = this.mapper.toPersistence(param);
    const updatedDTO = await this.model.update({
      where: {
        id: param.id
      },
      data: parsedDTO.getValue()
    });
    const updatedDomain = this.mapper.toDomain(updatedDTO);
    return updatedDomain;
  }
  async delete(param) {
    const result = await this.model.delete({
      where: {
        id: param.id
      }
    });
    return Result.ok(param);
  }
  async getById(id) {
    const parsedDTO = await this.model.findUnique({
      where: {
        id
      }
    });
    if (parsedDTO == null) {
      return Result.fail("Not found");
    } else {
      return this.mapper.toDomain(parsedDTO);
    }
  }
};
__name(RepositorioBase, "RepositorioBase");

// src/infrastructure/data/repository/ano/AnoRepositorio.ts
var AnoRepositorio = class extends RepositorioBase {
  constructor() {
    const { ano } = PrismaContext.getInstance();
    const mapper = AnoMapper.getInstance();
    super(mapper, ano);
  }
};
__name(AnoRepositorio, "AnoRepositorio");

// src/core/services/ServiceBase.ts
var ServiceBase = class {
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
__name(ServiceBase, "ServiceBase");

// src/domain/ano/services/AnoService.ts
var AnoService = class extends ServiceBase {
  constructor(repo) {
    super(repo);
  }
};
__name(AnoService, "AnoService");

// src/presentation/controllers/ano/AnoController.ts
var import_zod2 = require("zod");

// src/aplication/services/ano/dtos/AnoDTO.ts
var import_zod = require("zod");
var _AnoDTO = class {
  constructor(data) {
    __publicField(this, "id");
    __publicField(this, "descricao");
    const validateData = _AnoDTO.schema.parse(data);
    this.id = validateData.id;
    this.descricao = validateData.descricao;
  }
};
var AnoDTO = _AnoDTO;
__name(AnoDTO, "AnoDTO");
__publicField(AnoDTO, "schema", import_zod.z.object({
  id: import_zod.z.string().optional(),
  descricao: import_zod.z.string()
}));

// src/presentation/controllers/ano/AnoController.ts
var paramsSchema = import_zod2.z.object({
  id: import_zod2.z.string()
});
var AnoController = class {
  constructor(service) {
    __publicField(this, "service");
    this.service = service;
  }
  async create(request, reply) {
    const anoDTO = new AnoDTO(request.body);
    const created = await this.service.create(anoDTO);
    return reply.status(201).send(created);
  }
  async get(request) {
    return await this.service.get();
  }
  async getById(request) {
    const param = paramsSchema.parse(request.params);
    return await this.service.getById(param.id);
  }
  async delete(request, reply) {
    const param = paramsSchema.parse(request.params);
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
    const param = paramsSchema.parse(request.params);
    const anoDTO = new AnoDTO(request.body);
    anoDTO.id = param.id;
    const created = await this.service.update(anoDTO);
    return reply.status(201).send(created);
  }
};
__name(AnoController, "AnoController");

// src/aplication/services/ano/usecases/AnoAppService.ts
var AnoAppService = class {
  constructor(service) {
    __publicField(this, "service");
    __publicField(this, "mapper");
    this.service = service;
    this.mapper = AnoMapper.getInstance();
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
    const entity = this.mapper.toDomain(dto);
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
    const entity = this.mapper.toDomain(dto);
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

// src/presentation/router/ano/RouteAno.ts
var RouteAno = class {
  constructor(controller) {
    __publicField(this, "controller");
    __publicField(this, "route");
    this.controller = controller;
    this.route = "ano";
  }
  registerRoutes(app) {
    app.post(`/${this.route}`, async (request, reply) => {
      await this.controller.create(request, reply);
    });
    app.get(`/${this.route}`, async (request) => {
      return this.controller.get(request);
    });
    app.get(`/${this.route}/:id`, async (request, reply) => {
      return this.controller.getById(request, reply);
    });
    app.delete(`/${this.route}/:id`, async (request, reply) => {
      return this.controller.delete(request, reply);
    });
    app.put(`/${this.route}/:id`, async (request, reply) => {
      return this.controller.update(request, reply);
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

// src/infrastructure/crosscutting/adapter/mappers/PactuacaoMapper.ts
var _PactuacaoMapper = class {
  constructor() {
  }
  static getInstance() {
    if (!_PactuacaoMapper.instance) {
      _PactuacaoMapper.instance = new _PactuacaoMapper();
    }
    return _PactuacaoMapper.instance;
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
  toDTO(object) {
    return Result.ok({
      id: object.id,
      descricao: object.props.descricao,
      programa: object.props.programa
    });
  }
};
var PactuacaoMapper = _PactuacaoMapper;
__name(PactuacaoMapper, "PactuacaoMapper");
__publicField(PactuacaoMapper, "instance");

// src/infrastructure/data/repository/pactuacao/PactuacaoRepositorio.ts
var PactuacaoRepositorio = class extends RepositorioBase {
  constructor() {
    const { pactuacao } = PrismaContext.getInstance();
    const mapper = PactuacaoMapper.getInstance();
    super(mapper, pactuacao);
  }
};
__name(PactuacaoRepositorio, "PactuacaoRepositorio");

// src/domain/pactuacao/services/PactuacaoService.ts
var PactuacaoService = class extends ServiceBase {
  constructor(repo) {
    super(repo);
  }
};
__name(PactuacaoService, "PactuacaoService");

// src/aplication/services/pactuacao/PactuacaoAppService.ts
var PactuacaoAppService = class {
  constructor(service) {
    __publicField(this, "service");
    __publicField(this, "mapper");
    this.service = service;
    this.mapper = PactuacaoMapper.getInstance();
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
    const entity = this.mapper.toDomain(dto);
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
    const entity = this.mapper.toDomain(dto);
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

// src/presentation/router/pactuacao/RoutePactuacao.ts
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
var import_zod4 = require("zod");

// src/aplication/services/pactuacao/dtos/PactuacaoDTO.ts
var import_zod3 = require("zod");
var _PactuacaoDTO = class {
  constructor(data) {
    __publicField(this, "id");
    __publicField(this, "descricao");
    __publicField(this, "programa");
    const validateData = _PactuacaoDTO.schema.parse(data);
    this.id = validateData.id;
    this.programa = validateData.programa;
    this.descricao = validateData.descricao;
  }
};
var PactuacaoDTO = _PactuacaoDTO;
__name(PactuacaoDTO, "PactuacaoDTO");
__publicField(PactuacaoDTO, "schema", import_zod3.z.object({
  id: import_zod3.z.string().optional(),
  descricao: import_zod3.z.string(),
  programa: import_zod3.z.string()
}));

// src/presentation/controllers/pactuacao/PactuacaoController.ts
var paramsSchema2 = import_zod4.z.object({
  id: import_zod4.z.string()
});
var PactuacaoController = class {
  constructor(service) {
    __publicField(this, "service");
    this.service = service;
  }
  async create(request, reply) {
    const dto = new PactuacaoDTO(request.body);
    const created = await this.service.create(dto);
    return reply.status(201).send(created);
  }
  async get(request) {
    return await this.service.get();
  }
  async getById(request) {
    const param = paramsSchema2.parse(request.params);
    return await this.service.getById(param.id);
  }
  async delete(request, reply) {
    const param = paramsSchema2.parse(request.params);
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
    const param = paramsSchema2.parse(request.params);
    const anoDTO = new PactuacaoDTO(request.body);
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

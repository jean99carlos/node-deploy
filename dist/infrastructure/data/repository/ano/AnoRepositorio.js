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

// src/infrastructure/data/repository/ano/AnoRepositorio.ts
var AnoRepositorio_exports = {};
__export(AnoRepositorio_exports, {
  AnoRepositorio: () => AnoRepositorio
});
module.exports = __toCommonJS(AnoRepositorio_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnoRepositorio
});

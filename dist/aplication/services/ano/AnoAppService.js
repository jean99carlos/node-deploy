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

// src/aplication/services/ano/AnoAppService.ts
var AnoAppService_exports = {};
__export(AnoAppService_exports, {
  AnoAppService: () => AnoAppService
});
module.exports = __toCommonJS(AnoAppService_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnoAppService
});

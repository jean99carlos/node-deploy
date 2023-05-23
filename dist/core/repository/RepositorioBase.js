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

// src/core/repository/RepositorioBase.ts
var RepositorioBase_exports = {};
__export(RepositorioBase_exports, {
  RepositorioBase: () => RepositorioBase
});
module.exports = __toCommonJS(RepositorioBase_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RepositorioBase
});

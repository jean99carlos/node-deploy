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

// src/domain/ano/services/AnoService.ts
var AnoService_exports = {};
__export(AnoService_exports, {
  AnoService: () => AnoService
});
module.exports = __toCommonJS(AnoService_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnoService
});

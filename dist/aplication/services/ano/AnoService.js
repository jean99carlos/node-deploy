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

// src/aplication/services/ano/AnoService.ts
var AnoService_exports = {};
__export(AnoService_exports, {
  AnoService: () => AnoService
});
module.exports = __toCommonJS(AnoService_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnoService
});

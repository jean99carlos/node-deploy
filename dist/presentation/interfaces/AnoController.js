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

// src/presentation/interfaces/AnoController.ts
var AnoController_exports = {};
__export(AnoController_exports, {
  default: () => AnoController
});
module.exports = __toCommonJS(AnoController_exports);
var import_zod = require("zod");
var createAnoSchema = import_zod.z.object({
  id: import_zod.z.string().optional(),
  descricao: import_zod.z.string().optional()
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
    const anoDTO = createAnoSchema.parse(request.params);
    if (anoDTO.id == void 0) {
      return null;
    }
    return await this.service.getById(anoDTO.id);
  }
  async delete(request, reply) {
    const anoDTO = createAnoSchema.parse(request.params);
    if (anoDTO.id == void 0) {
      return reply.status(500).send("Not found");
    }
    const result = await this.service.delete(anoDTO.id);
    if (result.isFailure) {
      return reply.status(500).send(result);
    }
    return reply.status(201).send(result);
  }
};
__name(AnoController, "AnoController");

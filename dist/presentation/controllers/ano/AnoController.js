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

// src/presentation/controllers/ano/AnoController.ts
var AnoController_exports = {};
__export(AnoController_exports, {
  default: () => AnoController
});
module.exports = __toCommonJS(AnoController_exports);
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

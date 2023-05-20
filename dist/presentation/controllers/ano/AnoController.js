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
var AnoController = class {
  constructor(service) {
    __publicField(this, "service");
    this.service = service;
  }
  registerRoutes(app) {
    app.post("/ano", (request, reply) => {
      this.create(request, reply);
    });
    app.get("/ano", async (request) => {
      const anos = await this.get(request);
      return anos;
    });
  }
  create(request, reply) {
  }
  async get(request) {
    const anos = await this.service.get();
    return anos;
  }
};
__name(AnoController, "AnoController");

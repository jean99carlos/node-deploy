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

// src/presentation/router/RouteAno.ts
var RouteAno_exports = {};
__export(RouteAno_exports, {
  RouteAno: () => RouteAno
});
module.exports = __toCommonJS(RouteAno_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RouteAno
});

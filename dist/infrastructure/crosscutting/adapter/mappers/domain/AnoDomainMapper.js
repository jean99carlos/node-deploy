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

// src/infrastructure/crosscutting/adapter/mappers/domain/AnoDomainMapper.ts
var AnoDomainMapper_exports = {};
__export(AnoDomainMapper_exports, {
  AnoDomainMapper: () => AnoDomainMapper
});
module.exports = __toCommonJS(AnoDomainMapper_exports);

// src/core/domain/Entity.ts
var Entity = class {
  constructor(props, id) {
    __publicField(this, "id");
    __publicField(this, "props");
    this.props = props;
    this.id = id ?? crypto.randomUUID();
  }
};
__name(Entity, "Entity");

// src/domain/ano/entities/Ano.ts
var Ano = class extends Entity {
  constructor(props, id) {
    super(props, id);
  }
  static create(props, id) {
    const ano = new Ano(props, id);
    return ano;
  }
};
__name(Ano, "Ano");

// src/infrastructure/crosscutting/adapter/mappers/domain/AnoDomainMapper.ts
var _AnoDomainMapper = class {
  constructor() {
  }
  static getInstance() {
    if (!_AnoDomainMapper.instance) {
      _AnoDomainMapper.instance = new _AnoDomainMapper();
    }
    return _AnoDomainMapper.instance;
  }
  toDomain(raw) {
    return Ano.create({
      descricao: raw.descricao
    }, raw.id ?? void 0);
  }
  toPersistence(ano) {
    return {
      id: ano.id,
      descricao: ano.props.descricao
    };
  }
};
var AnoDomainMapper = _AnoDomainMapper;
__name(AnoDomainMapper, "AnoDomainMapper");
__publicField(AnoDomainMapper, "instance");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnoDomainMapper
});

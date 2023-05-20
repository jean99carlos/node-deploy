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

// src/infrastructure/crosscutting/adapter/mappers/aplication/AnoAppMapper.ts
var AnoAppMapper_exports = {};
__export(AnoAppMapper_exports, {
  AnoAppMapper: () => AnoAppMapper
});
module.exports = __toCommonJS(AnoAppMapper_exports);

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
    }, raw.id ?? void 0);
  }
  toDTO(ano) {
    return {
      id: ano.id,
      descricao: ano.props.descricao
    };
  }
};
var AnoAppMapper = _AnoAppMapper;
__name(AnoAppMapper, "AnoAppMapper");
__publicField(AnoAppMapper, "instance");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnoAppMapper
});

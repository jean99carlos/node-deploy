"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// node_modules/fastify-plugin/lib/getPluginName.js
var require_getPluginName = __commonJS({
  "node_modules/fastify-plugin/lib/getPluginName.js"(exports, module2) {
    "use strict";
    var fpStackTracePattern = /at\s{1}(?:.*\.)?plugin\s{1}.*\n\s*(.*)/;
    var fileNamePattern = /(\w*(\.\w*)*)\..*/;
    module2.exports = /* @__PURE__ */ __name(function getPluginName(fn) {
      if (fn.name.length > 0)
        return fn.name;
      const stackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = 10;
      try {
        throw new Error("anonymous function");
      } catch (e) {
        Error.stackTraceLimit = stackTraceLimit;
        return extractPluginName(e.stack);
      }
    }, "getPluginName");
    function extractPluginName(stack) {
      const m = stack.match(fpStackTracePattern);
      return m ? m[1].split(/[/\\]/).slice(-1)[0].match(fileNamePattern)[1] : "anonymous";
    }
    __name(extractPluginName, "extractPluginName");
    module2.exports.extractPluginName = extractPluginName;
  }
});

// node_modules/fastify-plugin/lib/toCamelCase.js
var require_toCamelCase = __commonJS({
  "node_modules/fastify-plugin/lib/toCamelCase.js"(exports, module2) {
    "use strict";
    module2.exports = /* @__PURE__ */ __name(function toCamelCase(name) {
      if (name[0] === "@") {
        name = name.slice(1).replace("/", "-");
      }
      const newName = name.replace(/-(.)/g, function(match, g1) {
        return g1.toUpperCase();
      });
      return newName;
    }, "toCamelCase");
  }
});

// node_modules/fastify-plugin/plugin.js
var require_plugin = __commonJS({
  "node_modules/fastify-plugin/plugin.js"(exports, module2) {
    "use strict";
    var getPluginName = require_getPluginName();
    var toCamelCase = require_toCamelCase();
    var count = 0;
    function plugin(fn, options = {}) {
      let autoName = false;
      if (typeof fn.default !== "undefined") {
        fn = fn.default;
      }
      if (typeof fn !== "function") {
        throw new TypeError(`fastify-plugin expects a function, instead got a '${typeof fn}'`);
      }
      if (typeof options === "string") {
        options = {
          fastify: options
        };
      }
      if (typeof options !== "object" || Array.isArray(options) || options === null) {
        throw new TypeError("The options object should be an object");
      }
      if (options.fastify !== void 0 && typeof options.fastify !== "string") {
        throw new TypeError(`fastify-plugin expects a version string, instead got '${typeof options.fastify}'`);
      }
      if (!options.name) {
        autoName = true;
        options.name = getPluginName(fn) + "-auto-" + count++;
      }
      fn[Symbol.for("skip-override")] = options.encapsulate !== true;
      fn[Symbol.for("fastify.display-name")] = options.name;
      fn[Symbol.for("plugin-meta")] = options;
      if (!fn.default) {
        fn.default = fn;
      }
      const camelCase = toCamelCase(options.name);
      if (!autoName && !fn[camelCase]) {
        fn[camelCase] = fn;
      }
      return fn;
    }
    __name(plugin, "plugin");
    module2.exports = plugin;
    module2.exports.default = plugin;
    module2.exports.fastifyPlugin = plugin;
  }
});

// src/core/server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_fastify = __toESM(require("fastify"));

// src/plugins/prisma.ts
var import_fastify_plugin = __toESM(require_plugin());
var import_client = require("@prisma/client");
var prismaPlugin = (0, import_fastify_plugin.default)(async (server, options) => {
  const prisma = new import_client.PrismaClient({
    log: [
      "error",
      "warn"
    ]
  });
  await prisma.$connect();
  server.decorate("prisma", prisma);
  server.addHook("onClose", async (server2) => {
    server2.log.info("disconnecting Prisma from DB");
    await server2.prisma.$disconnect();
  });
});
var prisma_default = prismaPlugin;

// src/aplication/controllers/ano/AnoController.ts
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
      console.log("controller");
      const anos = await this.get(request);
      console.log("anos controller", anos);
      return anos;
    });
  }
  create(request, reply) {
  }
  async get(request) {
    console.log("controller get");
    const anos = await this.service.get();
    return anos;
  }
};
__name(AnoController, "AnoController");

// src/core/repository/PrismaContext.ts
var import_client2 = require("@prisma/client");
var _PrismaContext = class {
  constructor() {
  }
  static getInstance() {
    if (!_PrismaContext.context) {
      _PrismaContext.context = new import_client2.PrismaClient();
    }
    return _PrismaContext.context;
  }
};
var PrismaContext = _PrismaContext;
__name(PrismaContext, "PrismaContext");
__publicField(PrismaContext, "context");

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

// src/domain/entities/ano/Ano.ts
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

// src/core/domain/mappers/MapperAno.ts
var MapperAno = class {
  static toDomain(raw) {
    return Ano.create({
      descricao: raw.descricao
    }, raw.id ?? void 0);
  }
  static toPersistence(ano) {
    return {
      id: ano.id,
      descricao: ano.props.descricao
    };
  }
};
__name(MapperAno, "MapperAno");

// src/aplication/repository/ano/AnoRepositorio.ts
var AnoRepositorio = class {
  constructor() {
    __publicField(this, "prisma");
    this.prisma = PrismaContext.getInstance();
  }
  async get() {
    console.log("repo");
    const anosDTO = await this.prisma.ano.findMany();
    const anos = anosDTO.map((anoDTO) => MapperAno.toDomain(anoDTO));
    return anos;
  }
  async create(param) {
    const anoDTO = MapperAno.toPersistence(param);
    const createdAnoDTO = await this.prisma.ano.create({
      data: anoDTO
    });
    const createdAno = MapperAno.toDomain(createdAnoDTO);
    return createdAno;
  }
  async update(param) {
    const anoDTO = MapperAno.toPersistence(param);
    const updatedAnoDTO = await this.prisma.ano.update({
      where: {
        id: param.id
      },
      data: anoDTO
    });
    const updatedAno = MapperAno.toDomain(updatedAnoDTO);
    return updatedAno;
  }
  async delete(param) {
    await this.prisma.ano.delete({
      where: {
        id: param.id
      }
    });
  }
  async getById(id) {
    const anoDTO = await this.prisma.ano.findUnique({
      where: {
        id
      }
    });
    if (anoDTO) {
      const ano = MapperAno.toDomain(anoDTO);
      return ano;
    }
  }
};
__name(AnoRepositorio, "AnoRepositorio");

// src/aplication/services/AnoService.ts
var AnoService = class {
  constructor(repo) {
    __publicField(this, "repo");
    this.repo = repo;
  }
  get() {
    console.log("service");
    if (!this.repo)
      throw new Error("Repo null");
    return this.repo?.get();
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

// src/core/server.ts
var server_default = /* @__PURE__ */ __name(() => {
  const app = (0, import_fastify.default)();
  app.register(prisma_default);
  var anoRepositorio = new AnoRepositorio();
  var anoService = new AnoService(anoRepositorio);
  var anoController = new AnoController(anoService);
  anoController.registerRoutes(app);
  app.listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333
  }).then(() => {
    console.log("HTTP Server Running on port " + (process.env.PORT ? Number(process.env.PORT) : 3333).toString());
  });
}, "default");

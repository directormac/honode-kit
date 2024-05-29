"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
module.exports = __toCommonJS(src_exports);
var import_node_server = require("@hono/node-server");
var import_hono = require("hono");
var app = new import_hono.Hono();
var routes = app.get("/", (c) => {
  return c.text("Hello Hono!");
}).get("/hello/:name", (c) => c.json(c.req.query("name")));
var port = 3e3;
console.log(`Server is running on port ${port}`);
(0, import_node_server.serve)({
  fetch: app.fetch,
  port
});

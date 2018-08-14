"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var encoders = {
  json: function json(content) {
    return JSON.stringify(content);
  }
};

var encode = function encode(type, content) {
  if (!encoders[type]) {
    throw new Error("Unknown file type: " + type);
  }

  return encoders[type](content);
};

exports.default = encode;
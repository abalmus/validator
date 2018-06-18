"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XRegExp = require("xregexp");
function pattern(value, regexp) {
    return XRegExp(regexp).test(String(value));
}
exports.default = pattern;
;

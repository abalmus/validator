"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pattern(value, regexp) {
    return RegExp(regexp).test(String(value));
}
exports.default = pattern;
;

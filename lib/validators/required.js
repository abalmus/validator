"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function required(value, rule) {
    return (Boolean(rule) && (typeof value !== 'undefined' && value !== '' && value !== null && value !== false));
}
exports.default = required;
;

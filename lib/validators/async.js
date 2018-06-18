"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("whatwg-fetch");
function async(value, config) {
    return new Promise(function (resolve, reject) {
        fetch(config.url, config)
            .then(function (response) { return (response.json()); })
            .then(function (response) {
            if (response.status === 'ERROR') {
                reject(response.message);
            }
            resolve(response);
        }).catch(function (reason) {
            reject(reason);
        });
    });
}
exports.default = async;
;

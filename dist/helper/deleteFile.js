"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const deleteFiles = (files) => {
    if (files) {
        files.forEach((val) => {
            fs_1.default.unlink(val.path, (err) => {
                try {
                    if (err)
                        throw err;
                }
                catch (error) {
                    console.log(error);
                }
            });
        });
    }
};
exports.default = deleteFiles;

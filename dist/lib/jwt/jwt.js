"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = "abc123";
const createToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, secretKey, {
        expiresIn: "12h",
    });
};
exports.createToken = createToken;
const validateToken = (token) => {
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        return decodedToken;
    }
    catch (error) {
        throw new Error("Invalid token");
    }
};
exports.validateToken = validateToken;

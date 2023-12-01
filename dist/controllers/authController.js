"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
const argon = __importStar(require("argon2"));
const jwt_1 = require("../lib/jwt/jwt");
const prisma = new client_1.PrismaClient();
class AuthController {
    static createUser(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                if (!username || !email || !password)
                    throw new Error("Data not complite!!");
                const hash = yield argon.hash(password);
                const newUser = yield prisma.user.create({
                    data: {
                        username,
                        email,
                        hash,
                    },
                });
                const token = (0, jwt_1.createToken)({ userId: newUser.id });
                return res.status(200).json({ token: token });
            }
            catch (error) {
                if (error instanceof library_1.PrismaClientKnownRequestError) {
                    if (error.code === "P2002") {
                        const target = (_a = error === null || error === void 0 ? void 0 : error.meta) === null || _a === void 0 ? void 0 : _a.target;
                        if (target && target[0] === "username") {
                            return res.status(400).json({ error: "Username must be unique" });
                        }
                        else if (target && target[0] === "email")
                            return res.status(400).json({ error: "Email must be unique" });
                    }
                }
                return res.status(500).json({ error: error.message });
            }
        });
    }
    static userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });
                if (!user)
                    throw { message: "email not found" };
                const pwMatches = yield argon.verify(user.hash, password);
                if (!pwMatches)
                    throw { message: "Incorrect password" };
                const token = (0, jwt_1.createToken)({ userId: user.id });
                return res.status(200).send({
                    isSuccess: true,
                    message: "Login successfully",
                    token: token,
                });
            }
            catch (error) {
                return res.status(401).send({
                    isSuccess: false,
                    message: error.message,
                });
            }
        });
    }
    static getMe(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = (_a = req.dataToken) === null || _a === void 0 ? void 0 : _a.userId;
                const user = yield prisma.user.findUnique({
                    where: {
                        id: userId,
                    },
                    select: {
                        username: true,
                        image: true,
                        email: true,
                        saldo: true,
                    },
                });
                if (!user)
                    throw { message: "unauthorization" };
                return res.status(200).send({
                    isSuccess: true,
                    message: "get user Successfully",
                    data: user,
                });
            }
            catch (error) {
                return res.status(401).send({
                    isSuccess: false,
                    message: error.message,
                });
            }
        });
    }
}
exports.AuthController = AuthController;

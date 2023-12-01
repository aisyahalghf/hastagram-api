"use strict";
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
exports.generateNumber = void 0;
const client_1 = require("@prisma/client");
const generateNumber = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    const random = () => {
        let random = (Math.random() + 1).toString(36).substring(2);
        let code = input + "_" + random;
        return code;
    };
    const randomCode = random();
    const checkingDatabase = yield prisma.history.findUnique({
        where: {
            code: randomCode,
        },
    });
    if (checkingDatabase) {
        return random();
    }
    return randomCode;
});
exports.generateNumber = generateNumber;

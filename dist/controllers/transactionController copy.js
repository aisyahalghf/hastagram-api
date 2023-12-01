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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const client_1 = require("@prisma/client");
const generateNumber_1 = require("../lib/generateNumber");
const node_cron_1 = __importDefault(require("node-cron"));
const prisma = new client_1.PrismaClient();
class TransactionController {
    static createTopUp(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = (_a = req.dataToken) === null || _a === void 0 ? void 0 : _a.userId;
                const dto = req.body;
                const { nominal, description } = dto;
                console.log(dto);
                if (!nominal)
                    throw new Error("nominal must be require");
                const user = yield prisma.user.findUnique({
                    where: {
                        id: userId,
                    },
                });
                if (!userId || !user)
                    throw new Error("unauthorization");
                const code = yield (0, generateNumber_1.generateNumber)("topup");
                const userTransaction = yield prisma.transaction.create({
                    data: {
                        userId,
                        code,
                        name: "topup",
                        nominal,
                        description,
                    },
                });
                node_cron_1.default.schedule("*/1 * * * *", () => __awaiter(this, void 0, void 0, function* () {
                    if (userTransaction) {
                        try {
                            yield prisma.transaction.update({
                                where: {
                                    code,
                                },
                                data: {
                                    status: "expired",
                                },
                            });
                        }
                        catch (error) {
                            console.error("Error:", error);
                        }
                    }
                }));
                return res.status(200).send({
                    isSuccess: true,
                    message: "Please provide proof of transfer immediately so that this process can be completed.",
                    data: userTransaction,
                });
            }
            catch (error) {
                res.status(500).send({
                    isSuccess: false,
                    error: error.message,
                });
            }
        });
    }
    static createTransfer(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = (_a = req.dataToken) === null || _a === void 0 ? void 0 : _a.userId;
                const dto = req.body;
                const { recipient, nominal, description } = dto;
                if (!nominal)
                    throw new Error("nominal must be require");
                if (!recipient)
                    throw new Error("reciepient's name must be require");
                const user = yield prisma.user.findUnique({
                    where: {
                        id: userId,
                    },
                });
                if (!userId || !user)
                    throw new Error("unauthorization");
                if (user.saldo < nominal)
                    throw new Error("Sorry, insufficient balance");
                const recipientName = yield prisma.user.findUnique({
                    where: {
                        username: recipient,
                    },
                });
                if (!recipientName)
                    throw new Error("Reciepient's name not found");
                const code = yield (0, generateNumber_1.generateNumber)("transfer");
                const codeIncome = yield (0, generateNumber_1.generateNumber)("income");
                yield prisma.transaction.createMany({
                    data: [
                        {
                            userId,
                            code,
                            name: "transfer",
                            nominal,
                            status: "done",
                            sender: user.username,
                            recipients: recipient,
                            description,
                        },
                        {
                            userId: recipientName.id,
                            code: codeIncome,
                            name: "income",
                            nominal,
                            status: "done",
                            sender: user.username,
                            recipients: recipient,
                            description,
                        },
                    ],
                });
                const updateBalanceUser = yield prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        saldo: user.saldo - nominal,
                    },
                });
                const updateBalanceRecipient = yield prisma.user.update({
                    where: {
                        username: recipient,
                    },
                    data: {
                        saldo: recipientName.saldo + nominal,
                    },
                });
                yield prisma.history.createMany({
                    data: [
                        {
                            code,
                            name: "transfer",
                            description: !description ? "no content" : description,
                            nominal: "-" + nominal.toString(),
                            userId,
                            balance: updateBalanceUser.saldo,
                            status: "done",
                            sender: user.username,
                            recipients: recipient,
                        },
                        {
                            code: codeIncome,
                            name: "income",
                            description: !description ? "no content" : description,
                            nominal: "+" + nominal.toString(),
                            userId: recipientName.id,
                            balance: updateBalanceRecipient.saldo,
                            status: "done",
                            sender: user.username,
                            recipients: recipient,
                        },
                    ],
                });
                return res.status(200).send({
                    isSuccess: true,
                    message: "Create Transfer Success",
                });
            }
            catch (error) {
                res.status(500).send({
                    isSuccess: false,
                    error: error.message,
                });
            }
        });
    }
    static uploadProof(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = (_a = req.dataToken) === null || _a === void 0 ? void 0 : _a.userId;
                let images = (_b = req.files) === null || _b === void 0 ? void 0 : _b.images[0].path;
                let { code } = req.params;
                const user = yield prisma.user.findUnique({
                    where: {
                        id: userId,
                    },
                });
                if (!userId || !user)
                    throw new Error("unauthorization");
                const transaction = yield prisma.transaction.findUnique({
                    where: {
                        code,
                        status: "waiting for payment proof",
                    },
                });
                if (!transaction || !code)
                    throw new Error("Data not found");
                const updateTransaction = yield prisma.transaction.update({
                    where: {
                        code,
                    },
                    data: {
                        status: "done",
                        proof: images,
                    },
                });
                const updateUser = yield prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        saldo: user.saldo + transaction.nominal,
                    },
                });
                yield prisma.history.create({
                    data: {
                        code,
                        name: transaction.name,
                        description: !transaction.description
                            ? "no content"
                            : transaction.description,
                        nominal: "+" + transaction.nominal.toString(),
                        userId,
                        balance: updateUser.saldo,
                        status: "done",
                    },
                });
                return res.status(200).send({
                    isSuccess: true,
                    message: "Image Proof Success",
                });
            }
            catch (error) {
                res.status(500).send({
                    isSuccess: false,
                    error: error.message,
                });
            }
        });
    }
}
exports.TransactionController = TransactionController;

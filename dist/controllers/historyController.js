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
exports.HistoryController = void 0;
const client_1 = require("@prisma/client");
const lib_1 = require("../lib");
const prisma = new client_1.PrismaClient();
class HistoryController {
    static history(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = (_a = req.dataToken) === null || _a === void 0 ? void 0 : _a.userId;
                const data = req.body;
                const { sort, search, filter } = data;
                const user = yield prisma.user.findUnique({
                    where: {
                        id: userId,
                    },
                });
                if (!userId || !user)
                    throw new Error("unauthorization");
                let dataFilter = {
                    code: {
                        contains: search,
                    },
                    userId,
                };
                let datas = {};
                if (filter === "income" || filter === "topup" || filter === "transfer") {
                    datas = Object.assign(Object.assign({}, dataFilter), { name: filter });
                }
                else if (filter === "waiting for payment proof" || filter === "done") {
                    datas = Object.assign(Object.assign({}, dataFilter), { status: filter });
                }
                else if (filter === "+" || filter === "-") {
                    datas = Object.assign(Object.assign({}, dataFilter), { nominal: {
                            contains: filter,
                        } });
                }
                else {
                    datas = dataFilter;
                }
                const histories = yield prisma.history.findMany({
                    where: datas,
                    orderBy: {
                        createdAt: sort === "asc" ? "asc" : "desc",
                    },
                });
                const dataToSend = histories.map((history) => {
                    const datahistory = Object.assign(Object.assign({}, history), { date: (0, lib_1.formateDate)(history.createdAt) });
                    return datahistory;
                });
                res.status(200).send({
                    isSuccess: true,
                    message: "Get history success",
                    data: dataToSend,
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
exports.HistoryController = HistoryController;

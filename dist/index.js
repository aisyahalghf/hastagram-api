"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRouter_1 = __importDefault(require("./router/authRouter"));
const transactionRouter_1 = __importDefault(require("./router/transactionRouter"));
const historyRouter_1 = __importDefault(require("./router/historyRouter"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors = require("cors");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
const port = 4000;
app.get("/", (req, res) => {
    res.send("express + typescript server run in port" + port);
});
app.use("/auth", authRouter_1.default);
app.use("/transaction", transactionRouter_1.default);
app.use("/history", historyRouter_1.default);
app.use("/user", userRouter_1.default);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

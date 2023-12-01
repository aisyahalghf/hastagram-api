import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./router/authRouter";
import transactionRouter from "./router/transactionRouter";
import historyRouter from "./router/historyRouter";
import userRouter from "./router/userRouter";

import bodyParser from "body-parser";
import cors = require("cors");

dotenv.config();

const app: Express = express();
app.use(cors<Request>());
app.use(express.json());
app.use(bodyParser.json());
const port = 4000;

app.get("/", (req: Request, res: Response) => {
  res.send("express + typescript server run in port" + port);
});

app.use("/auth", authRouter);
app.use("/transaction", transactionRouter);
app.use("/history", historyRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

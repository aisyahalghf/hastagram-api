import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { IGetUserAuthInfoRequest } from "../lib/jwt/verifyToken";
import { CreateTopUpDto, CreateTransferDto, TransactionDto } from "./dto";
import { generateNumber } from "../lib/generateNumber";
import { formateDate } from "../lib";

// import cron from "node-cron";

const prisma = new PrismaClient();
export class TransactionController {
  static async createTopUp(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.dataToken?.userId;
      const dto: CreateTopUpDto = req.body;
      const { nominal, description } = dto;

      if (!nominal) throw new Error("nominal must be require");

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!userId || !user) throw new Error("unauthorization");

      const code = await generateNumber("topup");
      const userTransaction = await prisma.transaction.create({
        data: {
          userId,
          code,
          name: "topup",
          nominal,
          description,
        },
      });

      await prisma.history.create({
        data: {
          userId,
          code,
          name: "topup",
          nominal: "+" + " " + nominal.toLocaleString(),
          description: !description ? "no content" : description,
          balance: user.saldo,
          status: "waiting for payment proof",
        },
      });
      // cron.schedule("*/1 * * * *", async () => {
      //   if (userTransaction) {
      //     try {
      //       await prisma.transaction.update({
      //         where: {
      //           code,
      //         },
      //         data: {
      //           status: "expired",
      //         },
      //       });
      //       await prisma.history.create({
      //         data: {
      //           userId,
      //           code,
      //           name: "topup",
      //           nominal: "+" + nominal.toString(),
      //           description: !description ? "no content" : description,
      //           balance: user.saldo,
      //           status: "expired",
      //         },
      //       });
      //     } catch (error) {
      //       console.error("Error:", error);
      //     }
      //   }
      // });

      return res.status(200).send({
        isSuccess: true,
        message:
          "Please provide proof of transfer immediately so that this process can be completed.",
        data: userTransaction,
      });
    } catch (error: any) {
      res.status(500).send({
        isSuccess: false,
        error: error.message,
      });
    }
  }

  static async createTransfer(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.dataToken?.userId;
      const dto: CreateTransferDto = req.body;
      const { recipient, nominal, description } = dto;

      if (!nominal) throw new Error("nominal must be require");
      if (!recipient) throw new Error("reciepient's name must be require");

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!userId || !user) throw new Error("unauthorization");
      if (user.saldo < nominal) throw new Error("Sorry, insufficient balance");

      const recipientName = await prisma.user.findUnique({
        where: {
          username: recipient,
        },
      });
      if (!recipientName) throw new Error("Reciepient's name not found");

      const code = await generateNumber("transfer");
      const codeIncome = await generateNumber("income");
      await prisma.transaction.createMany({
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

      const updateBalanceUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          saldo: user.saldo - nominal,
        },
      });

      const updateBalanceRecipient = await prisma.user.update({
        where: {
          username: recipient,
        },
        data: {
          saldo: recipientName.saldo + nominal,
        },
      });

      await prisma.history.createMany({
        data: [
          {
            code,
            name: "transfer",
            description: !description ? "no content" : description,
            nominal: "-" + " " + nominal.toLocaleString(),
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
            nominal: "-" + " " + nominal.toLocaleString(),
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
        message: `YAY! Transfer to ${recipient} with Rp. ${nominal.toLocaleString()} success`,
      });
    } catch (error: any) {
      res.status(500).send({
        isSuccess: false,
        error: error.message,
      });
    }
  }

  static async uploadProof(req: any, res: Response) {
    try {
      const userId = req.dataToken?.userId;
      let images = req.files?.images[0].path;
      let { code } = req.params;
      console.log(images);

      if (!images) throw new Error("Image not found");

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!userId || !user) throw new Error("unauthorization");

      const transaction = await prisma.transaction.findUnique({
        where: {
          code,
          status: "waiting for payment proof",
        },
      });
      if (!transaction || !code)
        throw new Error(`Transaction with ${code} not found`);

      await prisma.transaction.update({
        where: {
          code,
        },
        data: {
          status: "done",
          proof: images,
        },
      });

      const updateUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          saldo: user.saldo + transaction.nominal,
        },
      });

      await prisma.history.update({
        where: {
          userId,
          code,
        },
        data: {
          status: "done",
          proof: images,
          balance: updateUser.saldo,
        },
      });

      return res.status(200).send({
        isSuccess: true,
        message: `YAY! Upload proof success, your balance increased by Rp. ${transaction.nominal.toLocaleString()}`,
      });
    } catch (error: any) {
      res.status(500).send({
        isSuccess: false,
        error: error.message,
      });
    }
  }

  static async getActiveTransaction(
    req: IGetUserAuthInfoRequest,
    res: Response
  ) {
    try {
      const userId = req.dataToken?.userId;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!userId || !user) throw new Error("unauthorization");

      const activeTransaction = await prisma.transaction.findMany({
        where: {
          userId,
          status: "waiting for payment proof",
        },
      });

      const dataActiveMap = activeTransaction.map((transaction) => {
        const formatDate = formateDate(transaction.createdAt);
        return { ...transaction, date: formatDate };
      });

      res.status(200).send({
        isSuccess: true,
        message: "Get active transaction successfully",
        data: dataActiveMap,
      });
    } catch (error: any) {
      res.status(500).send({
        isSuccess: false,
        error: error.message,
      });
    }
  }
}

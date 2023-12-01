import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { IGetUserAuthInfoRequest } from "../lib/jwt/verifyToken";
import { FilterHistoryDto } from "./dto/filterHistory";
import { formateDate } from "../lib";

const prisma = new PrismaClient();
export class HistoryController {
  static async history(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.dataToken?.userId;
      const data: FilterHistoryDto = req.body;
      const { sort, search, filter } = data;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!userId || !user) throw new Error("unauthorization");

      let dataFilter = {
        code: {
          contains: search,
        },
        userId,
      };

      let datas = {};

      if (filter === "income" || filter === "topup" || filter === "transfer") {
        datas = { ...dataFilter, name: filter };
      } else if (filter === "waiting for payment proof" || filter === "done") {
        datas = { ...dataFilter, status: filter };
      } else if (filter === "+" || filter === "-") {
        datas = {
          ...dataFilter,
          nominal: {
            contains: filter,
          },
        };
      } else {
        datas = dataFilter;
      }
      const histories = await prisma.history.findMany({
        where: datas,
        orderBy: {
          createdAt: sort === "asc" ? "asc" : "desc",
        },
      });

      const dataToSend = histories.map((history) => {
        const datahistory = {
          ...history,
          date: formateDate(history.createdAt),
        };
        return datahistory;
      });

      res.status(200).send({
        isSuccess: true,
        message: "Get history success",
        data: dataToSend,
      });
    } catch (error: any) {
      res.status(500).send({
        isSuccess: false,
        error: error.message,
      });
    }
  }
}

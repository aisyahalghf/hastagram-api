import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { IGetUserAuthInfoRequest } from "../lib/jwt/verifyToken";

const prisma = new PrismaClient();
export class UserController {
  static async getUsers(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.dataToken?.userId;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!userId || !user) throw new Error("unauthorization");
      const users = await prisma.user.findMany({
        where: {
          NOT: {
            id: userId,
          },
        },
      });

      return res.status(200).send({
        isSuccess: true,
        message: "Get users success",
        data: users,
      });
    } catch (error: any) {
      res.status(500).send({
        isSuccess: false,
        error: error.message,
      });
    }
  }
}

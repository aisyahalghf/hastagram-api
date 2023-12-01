import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from "argon2";
import { createToken } from "../lib/jwt/jwt";
import { IGetUserAuthInfoRequest } from "../lib/jwt/verifyToken";
import { Auth } from "./dto/auth";

const prisma = new PrismaClient();
export class AuthController {
  static async createUser(req: Request, res: Response) {
    try {
      const { username, email, password }: Auth = req.body;

      if (!username || !email || !password)
        throw new Error("Data not complite!!");
      const hash = await argon.hash(password);
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          hash,
        },
      });
      const token = createToken({ userId: newUser.id });
      return res.status(200).json({ token: token });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          const target = error?.meta?.target as string[] | undefined;
          if (target && target[0] === "username") {
            return res.status(400).json({ error: "Username must be unique" });
          } else if (target && target[0] === "email")
            return res.status(400).json({ error: "Email must be unique" });
        }
      }
      return res.status(500).json({ error: error.message });
    }
  }

  static async userLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) throw { message: "email not found" };
      const pwMatches = await argon.verify(user.hash, password);
      if (!pwMatches) throw { message: "Incorrect password" };

      const token = createToken({ userId: user.id });

      return res.status(200).send({
        isSuccess: true,
        message: "Login successfully",
        token: token,
      });
    } catch (error: any) {
      return res.status(401).send({
        isSuccess: false,
        message: error.message,
      });
    }
  }

  static async getMe(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.dataToken?.userId;

      const user = await prisma.user.findUnique({
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

      if (!user) throw { message: "unauthorization" };

      return res.status(200).send({
        isSuccess: true,
        message: "get user Successfully",
        data: user,
      });
    } catch (error: any) {
      return res.status(401).send({
        isSuccess: false,
        message: error.message,
      });
    }
  }
}

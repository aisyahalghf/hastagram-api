import express from "express";
import { UserController } from "../controllers/userController";
import tokenVerify from "../lib/jwt/verifyToken";

const router = express.Router();

router.get("/", tokenVerify, UserController.getUsers);

export default router;

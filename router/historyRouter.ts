import express from "express";
import { HistoryController } from "../controllers";
import tokenVerify from "../lib/jwt/verifyToken";

const router = express.Router();
router.post("/", tokenVerify, HistoryController.history);

export default router;

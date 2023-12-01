import express from "express";
import { TransactionController } from "../controllers";
import tokenVerify from "../lib/jwt/verifyToken";
import uploadImages from "../middleware/upload";

const router = express.Router();
router.post("/topup", tokenVerify, TransactionController.createTopUp);
router.post("/transfer", tokenVerify, TransactionController.createTransfer);
router.get("/", tokenVerify, TransactionController.getActiveTransaction);
router.post(
  "/upload/:code",
  tokenVerify,
  uploadImages,
  TransactionController.uploadProof
);

export default router;

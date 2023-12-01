import express from "express";
import { AuthController } from "../controllers/authController";
import tokenVerify from "../lib/jwt/verifyToken";

const router = express.Router();

router.post("/signup", AuthController.createUser);
router.post("/signin", AuthController.userLogin);
router.get("/me", tokenVerify, AuthController.getMe);

export default router;

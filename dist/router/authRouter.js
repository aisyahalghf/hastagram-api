"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const verifyToken_1 = __importDefault(require("../lib/jwt/verifyToken"));
const router = express_1.default.Router();
router.post("/signup", authController_1.AuthController.createUser);
router.post("/signin", authController_1.AuthController.userLogin);
router.get("/me", verifyToken_1.default, authController_1.AuthController.getMe);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const verifyToken_1 = __importDefault(require("../lib/jwt/verifyToken"));
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
router.post("/topup", verifyToken_1.default, controllers_1.TransactionController.createTopUp);
router.post("/transfer", verifyToken_1.default, controllers_1.TransactionController.createTransfer);
router.get("/", verifyToken_1.default, controllers_1.TransactionController.getActiveTransaction);
router.post("/upload/:code", verifyToken_1.default, upload_1.default, controllers_1.TransactionController.uploadProof);
exports.default = router;

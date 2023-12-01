"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = require("./../lib/multer");
const deleteFile_1 = __importDefault(require("../helper/deleteFile"));
const uploadImages = (req, res, next) => {
    multer_1.multerUpload.fields([{ name: "images", maxCount: 1 }])(req, res, function (err) {
        var _a;
        try {
            if (err)
                throw err;
            next();
        }
        catch (error) {
            if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.images) {
                (0, deleteFile_1.default)(req.files.images);
            }
            res.status(400).send({
                isError: true,
                message: error.message || "Error occurred",
                data: null,
            });
        }
    });
};
exports.default = uploadImages;

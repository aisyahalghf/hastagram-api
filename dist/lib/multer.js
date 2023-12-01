"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
// Setup path
const defaultPath = "Public";
// Create storage engine
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
        // Check directory existence
        const isDirectoryExist = fs_1.default.existsSync(`${defaultPath}/${file.fieldname}`);
        if (!isDirectoryExist) {
            yield fs_1.default.promises.mkdir(`${defaultPath}/${file.fieldname}`, {
                recursive: true,
            });
        }
        // Create "public/pdf" or "public/images"
        if (file.fieldname === "files") {
            cb(null, `${defaultPath}/${file.fieldname}`); // public/files
        }
        if (file.fieldname === "images") {
            cb(null, `${defaultPath}/${file.fieldname}`); // public/image
        }
    }),
    filename: (req, file, cb) => {
        cb(null, "PIMG" +
            "_" +
            Date.now() +
            Math.round(Math.random() * 1000000000) +
            "." +
            file.mimetype.split("/")[1]); //[image,png]
    },
});
// File filter function
const fileFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image") {
        // Accepts
        cb(null, true);
    }
    else {
        // Rejects
        cb(new Error("File must be an image!"), false);
    }
};
// Multer upload middleware
const multerUpload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    // limits: { fileSize: 100000 },
}); // File size in bytes
exports.multerUpload = multerUpload;

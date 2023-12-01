import multer, { StorageEngine } from "multer";
import { Request } from "express";
import fs from "fs";

// Setup path
const defaultPath = "Public";

// Create storage engine
const storage: StorageEngine = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Check directory existence
    const isDirectoryExist = fs.existsSync(`${defaultPath}/${file.fieldname}`);

    if (!isDirectoryExist) {
      await fs.promises.mkdir(`${defaultPath}/${file.fieldname}`, {
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
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "PIMG" +
        "_" +
        Date.now() +
        Math.round(Math.random() * 1000000000) +
        "." +
        file.mimetype.split("/")[1]
    ); //[image,png]
  },
});

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.split("/")[0] === "image") {
    // Accepts
    cb(null, true);
  } else {
    // Rejects
    cb(new Error("File must be an image!"), false);
  }
};

// Multer upload middleware
const multerUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  // limits: { fileSize: 100000 },
}); // File size in bytes

export { multerUpload };

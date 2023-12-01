import { Request, Response, NextFunction } from "express";
import { multerUpload } from "./../lib/multer";
import deleteFiles from "../helper/deleteFile";

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface Contoh extends Request {
  images: MulterFile[];
}

const uploadImages = (req: any, res: Response, next: NextFunction) => {
  multerUpload.fields([{ name: "images", maxCount: 1 }])(
    req,
    res,
    function (err: any) {
      try {
        if (err) throw err;
        next();
      } catch (error: any) {
        if (req.files?.images) {
          deleteFiles(req.files.images);
        }
        res.status(400).send({
          isError: true,
          message: error.message || "Error occurred",
          data: null,
        });
      }
    }
  );
};

export default uploadImages;

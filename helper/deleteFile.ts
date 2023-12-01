import fs from "fs";

const deleteFiles = (files: Express.Multer.File[] | undefined) => {
  if (files) {
    files.forEach((val) => {
      fs.unlink(val.path, (err) => {
        try {
          if (err) throw err;
        } catch (error) {
          console.log(error);
        }
      });
    });
  }
};

export default deleteFiles;

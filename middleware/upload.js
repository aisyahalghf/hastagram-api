// Import Multer
const { multerUpload } = require("./../lib/multer");

//import delete files
const deleteFiles = require("../helper/deleteFile");

const uploadImages = (req, res, next) => {
  const multerResult = multerUpload.fields([{ name: "images", maxCount: 3 }]);
  multerResult(req, res, function (err) {
    try {
      if (err) throw err;
      //   console.log(req.files.images);

      // req.files.images.forEach((val) => {
      //   if (val.size > 1000000)
      //     throw { message: `${val.originalname} size too large` };
      // });

      next();
    } catch (error) {
      if (req.files.images) {
        deleteFiles(req.files.images);
      }
      res.status(400).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  });
};

module.exports = uploadImages;

const express = require("express");
const Router = express.Router();

//IMPORT CONTROLLER
const { userDetailController } = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");
const uploadImages = require("../middleware/upload");

Router.post(
  "/info",
  tokenVerify,
  uploadImages,
  userDetailController.userDetail
);
Router.patch(
  "/edit-photo-profile",
  tokenVerify,
  uploadImages,
  userDetailController.editPhotoProfile
);

module.exports = Router;

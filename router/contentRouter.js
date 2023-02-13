const express = require("express");
const Router = express.Router();

//IMPORT CONTROLLER
const { contentController } = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");
const uploadImages = require("../middleware/upload");

Router.post(
  "/create-content",
  tokenVerify,
  uploadImages,
  contentController.contenUpload
);
Router.patch("/edit/:id", tokenVerify, contentController.contentEdit);
Router.get("/all-content", tokenVerify, contentController.getAll);
Router.delete("/remove-content/:id", contentController.removeContent);
Router.get("/all-users-content", contentController.allUserContent);
Router.get("/content-params/:id", contentController.getUserContentParam);

module.exports = Router;

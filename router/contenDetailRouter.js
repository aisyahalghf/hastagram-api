const express = require("express");
const Router = express.Router();

//IMPORT CONTROLLER
const { contentDetail } = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");

Router.post("/create-comment/:id", tokenVerify, contentDetail.createComment);
Router.get("/all-comment", contentDetail.getAllComment);

module.exports = Router;

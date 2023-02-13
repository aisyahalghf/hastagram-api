const express = require("express");
const Router = express.Router();

//IMPORT CONTROLLER
const { usersController } = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");

Router.post("/sign-up", usersController.createUsers);
Router.post("/sign-in", usersController.loginUser);
Router.get("/keep-login", tokenVerify, usersController.keepLogin);
Router.patch("/verify", tokenVerify, usersController.verification);
Router.get("/resend-verified", tokenVerify, usersController.resendVerification);

module.exports = Router;

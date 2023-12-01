"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenVerify = void 0;
const jwt_1 = require("./jwt");
const tokenVerify = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({
            error: true,
            message: "token not found",
            isData: false,
            data: null,
        });
    }
    try {
        const decodeToken = (0, jwt_1.validateToken)(token);
        req.dataToken = decodeToken;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
exports.tokenVerify = tokenVerify;
exports.default = exports.tokenVerify;

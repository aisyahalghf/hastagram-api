import { Request, Response, NextFunction } from "express";
import { validateToken, JwtPayload } from "./jwt";

interface IGetUserAuthInfoRequest extends Request {
  dataToken?: JwtPayload;
}

export const tokenVerify = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
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
    const decodeToken = validateToken(token);
    req.dataToken = decodeToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default tokenVerify;
export { IGetUserAuthInfoRequest };

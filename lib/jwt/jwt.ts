import jwt from "jsonwebtoken";

const secretKey = "abc123";

interface JwtPayload {
  userId: string;
}

export const createToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, secretKey, {
    expiresIn: "12h",
  });
};

export const validateToken = (token: string): JwtPayload => {
  try {
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    return decodedToken;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export { JwtPayload };

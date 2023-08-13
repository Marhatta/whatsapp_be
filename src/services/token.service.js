import { sign, verify } from "../utils/token.util.js";

export const generateToken = async (payload, expiresIn, secret) => {
  const token = await sign(payload, expiresIn, secret);
  return token;
};

export const verifyToken = async (token, secret) => {
  const check = await verify(token, secret);
  return check;
};

import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(payload: {
  userId: string;
}) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
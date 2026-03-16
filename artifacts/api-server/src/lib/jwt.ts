import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "portfolio_super_secret_key_ranja_2025";
const JWT_EXPIRES_IN = "7d";

export interface JWTPayload {
  userId: number;
  username: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

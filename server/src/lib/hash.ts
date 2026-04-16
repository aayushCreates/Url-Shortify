import crypto from "crypto";
import { env } from "../config/env";

export function hashVisitor(ip: string, userAgent: string): string {
  return crypto
    .createHmac("sha256", env.IP_HASH_SALT)
    .update(`${ip}:${userAgent}`)
    .digest("hex");
}

export function hashPassword(password: string): Promise<string> {
  return Promise.resolve(
    crypto.createHash("sha256").update(password).digest("hex"),
  );
}

export function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const inputHash = crypto.createHash("sha256").update(password).digest("hex");
  return Promise.resolve(
    crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(hash)),
  );
}

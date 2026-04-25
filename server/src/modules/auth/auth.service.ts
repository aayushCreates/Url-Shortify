import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../../loaders/prisma";
import { env } from "../../config/env";
import { AppError, Errors } from "../../middleware/errorHandler";
import { JwtPayload } from "../../middleware/authenticate";
import { RegisterInput, LoginInput } from "./auth.schema";
import logger from "../../config/logger";

const BCRYPT_ROUNDS = 12;

export class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    console.log("User exists: ", existingUser);

    if (existingUser) {
      throw Errors.conflict("An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    console.log("Hashed password: ", passwordHash);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        name: input.name,
        passwordHash,
      },
    });

    console.log("Created user: ", user);

    const tokens = await this.generateTokenPair(user.id, user.role);

    logger.info(`User registered: ${user.email}`);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      ...tokens,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      throw Errors.notFound("User not found");
    }

    return { user };
  }

  async updateProfile(userId: string, input: { name: string; email: string }) {
    // Check email isn't taken by another user
    if (input.email) {
      const existing = await prisma.user.findUnique({
        where: { email: input.email.toLowerCase() },
      });
      if (existing && existing.id !== userId) {
        throw Errors.conflict("That email address is already in use");
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
      },
      select: { id: true, email: true, name: true, role: true },
    });

    logger.info(`Profile updated for user: ${user.email}`);
    return { user };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw Errors.unauthorized("Invalid email or password");
    }

    const passwordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!passwordValid) {
      throw Errors.unauthorized("Invalid email or password");
    }

    const tokens = await this.generateTokenPair(user.id, user.role);

    logger.info(`User logged in: ${user.email}`);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw Errors.unauthorized("Invalid refresh token");
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw Errors.unauthorized("Refresh token has expired");
    }

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const tokens = await this.generateTokenPair(
      storedToken.user.id,
      storedToken.user.role,
    );

    logger.info(`Token refreshed for: ${storedToken.user.email}`);

    return {
      user: {
        id: storedToken.user.id,
        email: storedToken.user.email,
        name: storedToken.user.name,
        role: storedToken.user.role,
      },
      ...tokens,
    };
  }

  async logout(refreshToken: string) {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (storedToken) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    }

    return { message: "Logged out successfully" };
  }

  async revokeAllTokens(userId: string) {
    const { count } = await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    logger.info(`Revoked ${count} refresh tokens for user: ${userId}`);
    return { message: `Revoked ${count} sessions` };
  }

  private async generateTokenPair(userId: string, role: string) {
    const payload: JwtPayload = { userId, role };

    const accessTokenExpirySeconds =
      this.parseExpiryToMs(env.JWT_ACCESS_EXPIRY) / 1000;

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: accessTokenExpirySeconds,
    });

    const refreshToken = crypto.randomBytes(40).toString("hex");

    const refreshExpiryMs = this.parseExpiryToMs(env.JWT_REFRESH_EXPIRY);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + refreshExpiryMs),
      },
    });

    await prisma.refreshToken.deleteMany({
      where: {
        userId,
        expiresAt: { lt: new Date() },
      },
    });

    return { accessToken, refreshToken };
  }

  private parseExpiryToMs(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 7 * 24 * 60 * 60 * 1000; // Default: 7 days
    }
    const [, value, unit] = match;
    const num = parseInt(value!, 10);
    switch (unit) {
      case "s":
        return num * 1000;
      case "m":
        return num * 60 * 1000;
      case "h":
        return num * 60 * 60 * 1000;
      case "d":
        return num * 24 * 60 * 60 * 1000;
      default:
        return 7 * 24 * 60 * 60 * 1000;
    }
  }
}

export const authService = new AuthService();

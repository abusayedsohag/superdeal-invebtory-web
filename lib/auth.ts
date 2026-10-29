import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AuthJWTPayload } from "@/types/user";

// JWT Secret Key setup
const JWT_SECRET_STRING = process.env.JWT_SECRET || "superdeal-secret-enterprise-auth-jwt-token-2026-key";
const JWT_SECRET_BYTES = new TextEncoder().encode(JWT_SECRET_STRING);
export const AUTH_COOKIE_NAME = "superdeal_auth_token";

/**
 * Hash password securely with Bcrypt
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

/**
 * Compare plain text password with hashed password
 */
export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

// Alias for convenience
export const verifyPassword = comparePassword;

/**
 * Sign JWT token containing user session payload
 */
export async function signAuthToken(payload: AuthJWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7 days active session
    .sign(JWT_SECRET_BYTES);
}

/**
 * Verify and decode JWT token
 */
export async function verifyAuthToken(token: string): Promise<AuthJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_BYTES);
    return payload as unknown as AuthJWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Get active user session payload from server cookie
 */
export async function getSessionUser(): Promise<AuthJWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

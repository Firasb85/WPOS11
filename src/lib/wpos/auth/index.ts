import { createHash, randomBytes } from "crypto";
import { executeQuery, queryOne } from "../db/client";

interface DbSession {
  id: string;
  user_id: string;
  expires_at: Date;
  is_revoked: boolean;
}

interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role_id: string;
  is_active: boolean;
  language: string;
  theme: string;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256")
    .update(password + salt)
    .digest("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  const computedHash = createHash("sha256")
    .update(password + salt)
    .digest("hex");
  return hash === computedHash;
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await executeQuery(`INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)`, [
    userId,
    token,
    expiresAt.toISOString(),
  ]);
  return token;
}

export async function validateSession(token: string): Promise<DbSession | null> {
  return queryOne<DbSession>(
    `SELECT id, user_id, expires_at, is_revoked FROM sessions WHERE token = $1 AND is_revoked = FALSE AND expires_at > NOW()`,
    [token],
  );
}

export async function revokeSession(token: string): Promise<void> {
  await executeQuery(`UPDATE sessions SET is_revoked = TRUE WHERE token = $1`, [token]);
}

export async function authenticateUser(email: string, password: string) {
  const user = await queryOne<DbUser>(
    `SELECT id, email, password_hash, first_name, last_name, role_id, is_active, language, theme FROM users WHERE email = $1 AND deleted_at IS NULL`,
    [email],
  );
  if (!user) return { success: false, error: "Invalid email or password" };
  if (!user.is_active) return { success: false, error: "Account is deactivated" };
  if (!verifyPassword(password, user.password_hash))
    return { success: false, error: "Invalid email or password" };

  const token = await createSession(user.id);
  await executeQuery(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [user.id]);

  const role = await queryOne<{ name: string }>(`SELECT name FROM roles WHERE id = $1`, [
    user.role_id,
  ]);

  return {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        roleId: user.role_id,
        roleName: role?.name,
        language: user.language,
        theme: user.theme,
      },
    },
  };
}

export async function createAuditLog(params: {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  description?: string;
}) {
  await executeQuery(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description) VALUES ($1, $2, $3, $4, $5)`,
    [
      params.userId || null,
      params.action,
      params.entityType,
      params.entityId || null,
      params.description || null,
    ],
  );
}

export async function getCurrentUser(token: string) {
  const session = await validateSession(token);
  if (!session) return null;
  const user = await queryOne<DbUser>(
    `SELECT id, email, first_name, last_name, role_id, is_active, language, theme FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [session.user_id],
  );
  if (!user) return null;
  const role = await queryOne<{ name: string }>(`SELECT name FROM roles WHERE id = $1`, [
    user.role_id,
  ]);
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    roleId: user.role_id,
    roleName: role?.name,
    language: user.language,
    theme: user.theme,
  };
}

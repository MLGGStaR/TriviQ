import { getStore } from "@netlify/blobs";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from "node:crypto";

const ACCOUNT_STORE_NAME = "triviq-accounts";
const USERNAME_PREFIX = "users/by-name/";
const USER_PREFIX = "users/by-id/";
const SESSION_PREFIX = "sessions/";
const SESSION_HEADER = "x-triviq-session";
const AUTH_SCHEME = "Bearer ";

function normalizeUsername(username){
  return String(username ?? "").trim().replace(/\s+/g, " ");
}

function validateUsername(username){
  const normalized = normalizeUsername(username);
  if(normalized.length < 3 || normalized.length > 24){
    return { ok: false, error: "Username must be 3-24 characters" };
  }
  if(!/^[A-Za-z0-9 _-]+$/.test(normalized)){
    return { ok: false, error: "Username can only use letters, numbers, spaces, hyphens, and underscores" };
  }
  return { ok: true, username: normalized };
}

function validatePassword(password){
  const normalized = String(password ?? "");
  if(normalized.length < 6){
    return { ok: false, error: "Password must be at least 6 characters" };
  }
  if(normalized.length > 128){
    return { ok: false, error: "Password is too long" };
  }
  return { ok: true, password: normalized };
}

function normalizeUsernameKey(username){
  return normalizeUsername(username).toLowerCase();
}

function userNameStoreKey(username){
  return `${USERNAME_PREFIX}${encodeURIComponent(normalizeUsernameKey(username))}`;
}

function userStoreKey(userId){
  return `${USER_PREFIX}${encodeURIComponent(userId)}`;
}

function hashToken(token){
  return createHash("sha256").update(String(token ?? "")).digest("hex");
}

function sessionStoreKey(sessionToken){
  return `${SESSION_PREFIX}${hashToken(sessionToken)}`;
}

function createPasswordSalt(){
  return randomBytes(16).toString("hex");
}

function hashPassword(password, salt){
  return scryptSync(password, salt, 64).toString("hex");
}

function verifyPassword(password, salt, expectedHash){
  const actualBuffer = Buffer.from(hashPassword(password, salt), "hex");
  const expectedBuffer = Buffer.from(String(expectedHash ?? ""), "hex");
  if(actualBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(actualBuffer, expectedBuffer);
}

function createSessionToken(){
  return randomBytes(32).toString("hex");
}

function json(body, init = {}){
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

function sanitizeUser(user){
  if(!user?.id || !user?.username) return null;
  return {
    id: String(user.id),
    username: normalizeUsername(user.username),
  };
}

export function getAccountStore(){
  return getStore({ name: ACCOUNT_STORE_NAME, consistency: "strong" });
}

export function readSessionTokenFromRequest(req){
  const headerToken = req.headers.get(SESSION_HEADER) || "";
  if(headerToken.trim()) return headerToken.trim();
  const authHeader = req.headers.get("authorization") || "";
  if(authHeader.startsWith(AUTH_SCHEME)) return authHeader.slice(AUTH_SCHEME.length).trim();
  return "";
}

export async function getUserByUsername(store, username){
  const stored = await store.get(userNameStoreKey(username), { type: "json" });
  return stored && typeof stored === "object" ? stored : null;
}

export async function getUserById(store, userId){
  const stored = await store.get(userStoreKey(userId), { type: "json" });
  return stored && typeof stored === "object" ? stored : null;
}

export async function createUserSession(store, user){
  const sessionToken = createSessionToken();
  const sessionRecord = {
    tokenHash: hashToken(sessionToken),
    userId: user.id,
    username: user.username,
    createdAt: new Date().toISOString(),
  };
  await store.set(sessionStoreKey(sessionToken), JSON.stringify(sessionRecord));
  return {
    sessionToken,
    user: sanitizeUser(user),
  };
}

export async function signupUser(store, username, password){
  const usernameCheck = validateUsername(username);
  if(!usernameCheck.ok) return { ok: false, status: 400, error: usernameCheck.error };
  const passwordCheck = validatePassword(password);
  if(!passwordCheck.ok) return { ok: false, status: 400, error: passwordCheck.error };
  const existing = await getUserByUsername(store, usernameCheck.username);
  if(existing){
    return { ok: false, status: 409, error: "Username is already taken" };
  }
  const salt = createPasswordSalt();
  const user = {
    id: randomUUID(),
    username: usernameCheck.username,
    usernameKey: normalizeUsernameKey(usernameCheck.username),
    passwordSalt: salt,
    passwordHash: hashPassword(passwordCheck.password, salt),
    createdAt: new Date().toISOString(),
  };
  await Promise.all([
    store.set(userNameStoreKey(user.username), JSON.stringify(user)),
    store.set(userStoreKey(user.id), JSON.stringify(user)),
  ]);
  const session = await createUserSession(store, user);
  return { ok: true, status: 200, ...session };
}

export async function loginUser(store, username, password){
  const usernameCheck = validateUsername(username);
  const passwordCheck = validatePassword(password);
  if(!usernameCheck.ok || !passwordCheck.ok){
    return { ok: false, status: 400, error: "Invalid username or password" };
  }
  const user = await getUserByUsername(store, usernameCheck.username);
  if(!user || !verifyPassword(passwordCheck.password, user.passwordSalt, user.passwordHash)){
    return { ok: false, status: 401, error: "Invalid username or password" };
  }
  const session = await createUserSession(store, user);
  return { ok: true, status: 200, ...session };
}

export async function getAuthenticatedSession(store, sessionToken){
  if(!sessionToken) return null;
  const session = await store.get(sessionStoreKey(sessionToken), { type: "json" });
  if(!session?.userId) return null;
  const user = await getUserById(store, session.userId);
  if(!user?.id) return null;
  return {
    session,
    user: sanitizeUser(user),
  };
}

export async function requireAuthenticatedUser(req){
  const store = getAccountStore();
  const sessionToken = readSessionTokenFromRequest(req);
  const auth = await getAuthenticatedSession(store, sessionToken);
  if(!auth){
    return { ok: false, status: 401, response: json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true, store, sessionToken, user: auth.user, session: auth.session };
}

export async function logoutSession(store, sessionToken){
  if(!sessionToken) return;
  await store.delete(sessionStoreKey(sessionToken));
}

export { json };

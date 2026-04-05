const ACCOUNT_SESSION_STORAGE_KEY = "triviq-account-session-v1";
const LOCAL_ACCOUNT_STORAGE_KEY = "triviq-local-accounts-v1";
const ACCOUNT_AUTH_ENDPOINT = "/.netlify/functions/account-auth";

function normalizeSession(session){
  const user = session?.user && typeof session.user === "object" ? session.user : null;
  const sessionToken = typeof session?.sessionToken === "string" ? session.sessionToken.trim() : "";
  if(!user?.id || !user?.username || !sessionToken) return null;
  return {
    sessionToken,
    user: {
      id: String(user.id),
      username: String(user.username),
    },
  };
}

function readStoredSession(){
  if(typeof window === "undefined") return null;
  try{
    const raw = window.localStorage.getItem(ACCOUNT_SESSION_STORAGE_KEY);
    if(!raw) return null;
    return normalizeSession(JSON.parse(raw));
  }catch{
    return null;
  }
}

function writeStoredSession(session){
  if(typeof window === "undefined") return;
  try{
    const normalized = normalizeSession(session);
    if(!normalized){
      window.localStorage.removeItem(ACCOUNT_SESSION_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(ACCOUNT_SESSION_STORAGE_KEY, JSON.stringify(normalized));
  }catch{
    // Ignore local storage failures.
  }
}

function authHeaders(sessionToken){
  return sessionToken ? { authorization: `Bearer ${sessionToken}` } : {};
}

function isUnavailableResponse(res){
  if(!res) return true;
  const contentType = String(res.headers?.get?.("content-type") || "").toLowerCase();
  return res.status === 404 || contentType.includes("text/html");
}

function readLocalAccounts(){
  if(typeof window === "undefined") return {};
  try{
    const raw = window.localStorage.getItem(LOCAL_ACCOUNT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  }catch{
    return {};
  }
}

function writeLocalAccounts(accounts){
  if(typeof window === "undefined") return;
  try{
    window.localStorage.setItem(LOCAL_ACCOUNT_STORAGE_KEY, JSON.stringify(accounts || {}));
  }catch{
    // Ignore local storage failures.
  }
}

function randomToken(){
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function localAccountKey(username){
  return String(username ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

function localValidate(username, password){
  const cleanUsername = String(username ?? "").trim().replace(/\s+/g, " ");
  const cleanPassword = String(password ?? "");
  if(cleanUsername.length < 3 || cleanUsername.length > 24){
    throw new Error("Username must be 3-24 characters");
  }
  if(!/^[A-Za-z0-9 _-]+$/.test(cleanUsername)){
    throw new Error("Username can only use letters, numbers, spaces, hyphens, and underscores");
  }
  if(cleanPassword.length < 6){
    throw new Error("Password must be at least 6 characters");
  }
  return { username: cleanUsername, password: cleanPassword };
}

function fallbackAuthAction(action, username, password){
  const { username: cleanUsername, password: cleanPassword } = localValidate(username, password);
  const accounts = readLocalAccounts();
  const key = localAccountKey(cleanUsername);
  const existing = accounts[key];
  if(action === "signup"){
    if(existing) throw new Error("Username is already taken");
    const user = {
      id: `local-${randomToken()}`,
      username: cleanUsername,
      password: cleanPassword,
      createdAt: new Date().toISOString(),
    };
    accounts[key] = user;
    writeLocalAccounts(accounts);
    const session = normalizeSession({ sessionToken: randomToken(), user });
    writeStoredSession(session);
    return session;
  }
  if(!existing || existing.password !== cleanPassword){
    throw new Error("Invalid username or password");
  }
  const session = normalizeSession({ sessionToken: randomToken(), user: existing });
  writeStoredSession(session);
  return session;
}

async function parseJson(res){
  return res.json().catch(() => null);
}

async function submitAuthAction(action, username, password){
  let res;
  try{
    res = await fetch(ACCOUNT_AUTH_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, username, password }),
    });
  }catch{
    return fallbackAuthAction(action, username, password);
  }
  if(isUnavailableResponse(res)){
    return fallbackAuthAction(action, username, password);
  }
  const data = await parseJson(res);
  if(!res.ok){
    throw new Error(data?.error || `${action} failed`);
  }
  const session = normalizeSession({
    sessionToken: data?.sessionToken,
    user: data?.user,
  });
  if(!session) throw new Error("Invalid auth response");
  writeStoredSession(session);
  return session;
}

export function getCachedAccountSession(){
  return readStoredSession();
}

export async function loadAccountSession(){
  const cached = readStoredSession();
  if(!cached) return null;
  const res = await fetch(ACCOUNT_AUTH_ENDPOINT, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(cached.sessionToken),
    },
    cache: "no-store",
  }).catch(() => null);
  if(isUnavailableResponse(res)){
    const accounts = readLocalAccounts();
    const localUser = accounts[localAccountKey(cached.user.username)];
    if(!localUser) {
      writeStoredSession(null);
      return null;
    }
    const session = normalizeSession({ sessionToken: cached.sessionToken, user: localUser });
    writeStoredSession(session);
    return session;
  }
  if(!res.ok){
    writeStoredSession(null);
    return null;
  }
  const data = await parseJson(res);
  const session = normalizeSession({
    sessionToken: cached.sessionToken,
    user: data?.user,
  });
  writeStoredSession(session);
  return session;
}

export async function signupAccount(username, password){
  return submitAuthAction("signup", username, password);
}

export async function loginAccount(username, password){
  return submitAuthAction("login", username, password);
}

export async function logoutAccount(sessionToken){
  try{
    await fetch(ACCOUNT_AUTH_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...authHeaders(sessionToken),
      },
      body: JSON.stringify({ action: "logout" }),
    });
  }catch{
    // Best-effort logout.
  }
  writeStoredSession(null);
}

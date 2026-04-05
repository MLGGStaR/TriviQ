import {
  getAccountStore,
  getAuthenticatedSession,
  json,
  loginUser,
  logoutSession,
  readSessionTokenFromRequest,
  signupUser,
} from "./_shared/triviqAuth.js";

export default async function handler(req){
  const store = getAccountStore();

  if(req.method === "GET"){
    const sessionToken = readSessionTokenFromRequest(req);
    const auth = await getAuthenticatedSession(store, sessionToken);
    if(!auth){
      return json({ authenticated: false, user: null }, { status: 401 });
    }
    return json({
      authenticated: true,
      user: auth.user,
    });
  }

  if(req.method === "POST"){
    const body = await req.json().catch(() => null);
    const action = String(body?.action || "").trim().toLowerCase();

    if(action === "signup"){
      const result = await signupUser(store, body?.username, body?.password);
      if(!result.ok){
        return json({ error: result.error }, { status: result.status });
      }
      return json({
        ok: true,
        sessionToken: result.sessionToken,
        user: result.user,
      });
    }

    if(action === "login"){
      const result = await loginUser(store, body?.username, body?.password);
      if(!result.ok){
        return json({ error: result.error }, { status: result.status });
      }
      return json({
        ok: true,
        sessionToken: result.sessionToken,
        user: result.user,
      });
    }

    if(action === "logout"){
      const sessionToken = readSessionTokenFromRequest(req);
      await logoutSession(store, sessionToken);
      return json({ ok: true });
    }

    return json({ error: "Unsupported action" }, { status: 400 });
  }

  return json(
    { error: "Method not allowed" },
    {
      status: 405,
      headers: { Allow: "GET, POST" },
    },
  );
}

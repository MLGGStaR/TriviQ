import { getStore } from "@netlify/blobs";

const QUESTION_USAGE_STORE = "triviq-question-usage";
const QUESTION_USAGE_PREFIX = "used/";
const RESET_TOKEN_KEY = "meta/reset-token";
const DEFAULT_RESET_TOKEN = "initial";
const ADMIN_SECRET_HEADER = "x-question-pool-admin-secret";

function normalizeQuestionIds(ids){
  return [...new Set((Array.isArray(ids)?ids:[]).filter((id)=>typeof id==="string"&&id.trim().length>0))].sort();
}

function toStoreKey(questionId){
  return `${QUESTION_USAGE_PREFIX}${encodeURIComponent(questionId)}`;
}

function fromStoreKey(storeKey){
  if(typeof storeKey!=="string"||!storeKey.startsWith(QUESTION_USAGE_PREFIX)) return null;
  try{
    return decodeURIComponent(storeKey.slice(QUESTION_USAGE_PREFIX.length));
  }catch{
    return null;
  }
}

function json(body, init={}){
  return new Response(JSON.stringify(body), {
    ...init,
    headers:{
      "Cache-Control":"no-store",
      "Content-Type":"application/json",
      ...(init.headers||{}),
    },
  });
}

async function readResetToken(store){
  const resetToken=await store.get(RESET_TOKEN_KEY, { type: "text" });
  if(typeof resetToken==="string"&&resetToken.trim().length>0) return resetToken;
  await store.set(RESET_TOKEN_KEY, DEFAULT_RESET_TOKEN);
  return DEFAULT_RESET_TOKEN;
}

function createResetToken(){
  return `${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
}

function getAdminSecret(req){
  return req.headers.get(ADMIN_SECRET_HEADER) || req.headers.get("x-admin-secret") || "";
}

export default async function handler(req){
  const store=getStore({ name: QUESTION_USAGE_STORE, consistency: "strong" });

  if(req.method==="GET"){
    const resetToken=await readResetToken(store);
    const result=await store.list({ prefix: QUESTION_USAGE_PREFIX, paginate: false });
    const usedQuestionIds=normalizeQuestionIds(
      result.blobs.map((blob)=>fromStoreKey(blob.key)).filter(Boolean),
    );
    return json({ usedQuestionIds, resetToken });
  }

  if(req.method==="POST"){
    const currentResetToken=await readResetToken(store);
    const body=await req.json().catch(()=>null);
    const requestResetToken=typeof body?.resetToken==="string"&&body.resetToken.trim().length>0?body.resetToken:DEFAULT_RESET_TOKEN;
    if(requestResetToken!==currentResetToken){
      return json({ error: "Reset token mismatch", resetToken: currentResetToken }, { status: 409 });
    }
    const ids=normalizeQuestionIds(body?.ids).slice(0, 5000);
    await Promise.all(ids.map((id)=>store.set(toStoreKey(id), "1")));
    return json({ ok: true, acceptedIds: ids, resetToken: currentResetToken });
  }

  if(req.method==="DELETE"){
    const configuredSecret=process.env.QUESTION_POOL_ADMIN_SECRET;
    if(!configuredSecret){
      return json({ error: "QUESTION_POOL_ADMIN_SECRET is not configured" }, { status: 500 });
    }
    if(getAdminSecret(req)!==configuredSecret){
      return json({ error: "Unauthorized" }, { status: 401 });
    }
    const result=await store.list({ prefix: QUESTION_USAGE_PREFIX, paginate: false });
    await Promise.all(result.blobs.map((blob)=>store.delete(blob.key)));
    const resetToken=createResetToken();
    await store.set(RESET_TOKEN_KEY, resetToken);
    return json({
      ok: true,
      deletedQuestionCount: result.blobs.length,
      resetToken,
    });
  }

  return json(
    { error: "Method not allowed" },
    {
      status: 405,
      headers:{ Allow: "GET, POST, DELETE" },
    },
  );
}

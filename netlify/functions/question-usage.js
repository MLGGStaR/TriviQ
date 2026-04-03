import { getStore } from "@netlify/blobs";

const QUESTION_USAGE_STORE = "triviq-question-usage";
const QUESTION_USAGE_PREFIX = "used/";

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

export default async function handler(req){
  const store=getStore({ name: QUESTION_USAGE_STORE, consistency: "strong" });

  if(req.method==="GET"){
    const result=await store.list({ prefix: QUESTION_USAGE_PREFIX, paginate: false });
    const usedQuestionIds=normalizeQuestionIds(
      result.blobs.map((blob)=>fromStoreKey(blob.key)).filter(Boolean),
    );
    return json({ usedQuestionIds });
  }

  if(req.method==="POST"){
    const body=await req.json().catch(()=>null);
    const ids=normalizeQuestionIds(body?.ids).slice(0, 5000);
    await Promise.all(ids.map((id)=>store.set(toStoreKey(id), "1")));
    return json({ ok: true, acceptedIds: ids });
  }

  return json(
    { error: "Method not allowed" },
    {
      status: 405,
      headers:{ Allow: "GET, POST" },
    },
  );
}

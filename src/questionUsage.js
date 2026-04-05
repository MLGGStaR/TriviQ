const QUESTION_USAGE_STORAGE_KEY = "triviq-used-question-ids-v3";
const QUESTION_USAGE_ENDPOINT = "/.netlify/functions/question-usage";
const DEFAULT_RESET_TOKEN = "initial";

function normalizeQuestionIds(ids){
  return [...new Set((Array.isArray(ids)?ids:[]).filter((id)=>typeof id==="string"&&id.trim().length>0))].sort();
}

function normalizeSnapshot(snapshot){
  return {
    ids: normalizeQuestionIds(snapshot?.ids),
    resetToken: typeof snapshot?.resetToken==="string"&&snapshot.resetToken.trim().length>0?snapshot.resetToken:DEFAULT_RESET_TOKEN,
  };
}

function storageKeyForAccount(accountId){
  return `${QUESTION_USAGE_STORAGE_KEY}:${accountId || "anonymous"}`;
}

function readLocalQuestionUsageSnapshot(accountId){
  if(typeof window==="undefined") return normalizeSnapshot();
  try{
    const raw=window.localStorage.getItem(storageKeyForAccount(accountId));
    if(!raw) return normalizeSnapshot();
    const parsed=JSON.parse(raw);
    if(Array.isArray(parsed)){
      return normalizeSnapshot({ ids: parsed, resetToken: DEFAULT_RESET_TOKEN });
    }
    return normalizeSnapshot(parsed);
  }catch{
    return normalizeSnapshot();
  }
}

function writeLocalQuestionUsageSnapshot(accountId, snapshot){
  if(typeof window==="undefined") return;
  try{
    window.localStorage.setItem(storageKeyForAccount(accountId), JSON.stringify(normalizeSnapshot(snapshot)));
  }catch{
    // Ignore storage failures and fall back to in-memory state.
  }
}

function authHeaders(sessionToken){
  return sessionToken ? { authorization: `Bearer ${sessionToken}` } : {};
}

async function fetchRemoteQuestionUsage(sessionToken){
  const res=await fetch(QUESTION_USAGE_ENDPOINT,{
    method:"GET",
    headers:{Accept:"application/json", ...authHeaders(sessionToken)},
    cache:"no-store",
  });
  if(!res.ok) throw new Error(`Question usage load failed with ${res.status}`);
  const data=await res.json();
  return normalizeSnapshot({
    ids: data?.usedQuestionIds,
    resetToken: data?.resetToken,
  });
}

async function pushRemoteQuestionUsage(ids, resetToken, sessionToken){
  const nextIds=normalizeQuestionIds(ids);
  if(nextIds.length===0) return normalizeSnapshot({ ids: [], resetToken });
  const res=await fetch(QUESTION_USAGE_ENDPOINT,{
    method:"POST",
    headers:{
      Accept:"application/json",
      "Content-Type":"application/json",
      ...authHeaders(sessionToken),
    },
    body:JSON.stringify({ ids: nextIds, resetToken }),
  });
  if(res.status===409){
    const data=await res.json().catch(()=>null);
    throw Object.assign(new Error("Question usage reset token mismatch"), {
      code: "RESET_TOKEN_MISMATCH",
      resetToken: data?.resetToken,
    });
  }
  if(!res.ok) throw new Error(`Question usage save failed with ${res.status}`);
  const data=await res.json();
  return normalizeSnapshot({
    ids: data?.acceptedIds?.length?data.acceptedIds:nextIds,
    resetToken: data?.resetToken||resetToken,
  });
}

export function mergeQuestionUsageIds(...lists){
  return normalizeQuestionIds(lists.flat());
}

export function getCachedQuestionUsageSnapshot(accountId){
  return readLocalQuestionUsageSnapshot(accountId);
}

export async function loadSharedQuestionUsage({ accountId, sessionToken } = {}){
  if(!accountId || !sessionToken) return normalizeSnapshot();
  const localSnapshot=readLocalQuestionUsageSnapshot(accountId);
  try{
    const remoteSnapshot=await fetchRemoteQuestionUsage(sessionToken);
    if(remoteSnapshot.resetToken!==localSnapshot.resetToken){
      writeLocalQuestionUsageSnapshot(accountId, remoteSnapshot);
      return remoteSnapshot;
    }
    const mergedIds=mergeQuestionUsageIds(localSnapshot.ids, remoteSnapshot.ids);
    const mergedSnapshot=normalizeSnapshot({
      ids: mergedIds,
      resetToken: remoteSnapshot.resetToken,
    });
    writeLocalQuestionUsageSnapshot(accountId, mergedSnapshot);
    const missingLocalIds=localSnapshot.ids.filter((id)=>!remoteSnapshot.ids.includes(id));
    if(missingLocalIds.length>0){
      try{
        await pushRemoteQuestionUsage(missingLocalIds, remoteSnapshot.resetToken, sessionToken);
      }catch{
        // Local cache still has the merged set, so retry on the next sync point.
      }
    }
    return mergedSnapshot;
  }catch{
    writeLocalQuestionUsageSnapshot(accountId, localSnapshot);
    return localSnapshot;
  }
}

export async function appendSharedQuestionUsage(currentIds, newIds, resetToken, { accountId, sessionToken } = {}){
  if(!accountId || !sessionToken) return normalizeSnapshot({ ids: currentIds, resetToken });
  const current=normalizeQuestionIds(currentIds);
  const next=mergeQuestionUsageIds(current, newIds);
  const delta=next.filter((id)=>!current.includes(id));
  const localSnapshot=normalizeSnapshot({ ids: next, resetToken });
  writeLocalQuestionUsageSnapshot(accountId, localSnapshot);
  if(delta.length===0) return localSnapshot;
  try{
    const remoteSnapshot=await pushRemoteQuestionUsage(delta, localSnapshot.resetToken, sessionToken);
    return normalizeSnapshot({
      ids: mergeQuestionUsageIds(next, remoteSnapshot.ids),
      resetToken: remoteSnapshot.resetToken,
    });
  }catch(error){
    if(error?.code==="RESET_TOKEN_MISMATCH"){
      return loadSharedQuestionUsage({ accountId, sessionToken });
    }
    return localSnapshot;
  }
}

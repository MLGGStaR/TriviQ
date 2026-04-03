const QUESTION_USAGE_STORAGE_KEY = "triviq-used-question-ids-v1";
const QUESTION_USAGE_ENDPOINT = "/.netlify/functions/question-usage";

function normalizeQuestionIds(ids){
  return [...new Set((Array.isArray(ids)?ids:[]).filter((id)=>typeof id==="string"&&id.trim().length>0))].sort();
}

function readLocalQuestionUsage(){
  if(typeof window==="undefined") return [];
  try{
    const raw=window.localStorage.getItem(QUESTION_USAGE_STORAGE_KEY);
    return normalizeQuestionIds(raw?JSON.parse(raw):[]);
  }catch{
    return [];
  }
}

function writeLocalQuestionUsage(ids){
  if(typeof window==="undefined") return;
  try{
    window.localStorage.setItem(QUESTION_USAGE_STORAGE_KEY, JSON.stringify(normalizeQuestionIds(ids)));
  }catch{
    // Ignore storage failures and fall back to in-memory state.
  }
}

async function fetchRemoteQuestionUsage(){
  const res=await fetch(QUESTION_USAGE_ENDPOINT,{
    method:"GET",
    headers:{Accept:"application/json"},
    cache:"no-store",
  });
  if(!res.ok) throw new Error(`Question usage load failed with ${res.status}`);
  const data=await res.json();
  return normalizeQuestionIds(data?.usedQuestionIds);
}

async function pushRemoteQuestionUsage(ids){
  const nextIds=normalizeQuestionIds(ids);
  if(nextIds.length===0) return [];
  const res=await fetch(QUESTION_USAGE_ENDPOINT,{
    method:"POST",
    headers:{
      Accept:"application/json",
      "Content-Type":"application/json",
    },
    body:JSON.stringify({ids:nextIds}),
  });
  if(!res.ok) throw new Error(`Question usage save failed with ${res.status}`);
  const data=await res.json();
  return normalizeQuestionIds(data?.acceptedIds?.length?data.acceptedIds:nextIds);
}

export function mergeQuestionUsageIds(...lists){
  return normalizeQuestionIds(lists.flat());
}

export function getCachedQuestionUsage(){
  return readLocalQuestionUsage();
}

export async function loadSharedQuestionUsage(){
  const localIds=readLocalQuestionUsage();
  try{
    const remoteIds=await fetchRemoteQuestionUsage();
    const mergedIds=mergeQuestionUsageIds(localIds, remoteIds);
    writeLocalQuestionUsage(mergedIds);
    const missingLocalIds=localIds.filter((id)=>!remoteIds.includes(id));
    if(missingLocalIds.length>0){
      try{
        await pushRemoteQuestionUsage(missingLocalIds);
      }catch{
        // Local cache still has the merged set, so retry on the next sync point.
      }
    }
    return mergedIds;
  }catch{
    writeLocalQuestionUsage(localIds);
    return localIds;
  }
}

export async function appendSharedQuestionUsage(currentIds, newIds){
  const current=normalizeQuestionIds(currentIds);
  const next=mergeQuestionUsageIds(current, newIds);
  const delta=next.filter((id)=>!current.includes(id));
  writeLocalQuestionUsage(next);
  if(delta.length===0) return next;
  try{
    await pushRemoteQuestionUsage(delta);
    return next;
  }catch{
    return next;
  }
}

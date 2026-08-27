import fs from "node:fs";
const files=["src/emojiGuessCategories.js","src/triviaMegaExpansions.js","src/triviaTierParityExpansions.js","src/triviaTierFinalParityExpansions.js","src/moreTriviaExpansions.js"];
const cats=new Set(["general_emoji","country_emoji","movie_show_emoji"]);
for(const f of files){
  const lines=fs.readFileSync(f,"utf8").split(/\r?\n/);
  let removed=0;
  for(let i=0;i<lines.length;i++){
    const m=lines[i].match(/^\s*([a-z_]+)\s*:\s*\{/);
    if(!m||!cats.has(m[1])) continue;
    // brace-walk from this line to find the closing line
    let depth=0, end=-1;
    for(let j=i;j<lines.length;j++){
      for(const ch of lines[j]){ if(ch==="{")depth++; else if(ch==="}")depth--; }
      if(depth<=0){ end=j; break; }
    }
    if(end<0){ console.log(f,"unterminated block at line",i+1); break; }
    console.log(f,"removing",m[1],"lines",i+1,"-",end+1);
    lines.splice(i,end-i+1); removed++; i--;
  }
  fs.writeFileSync(f,lines.join("\n"));
  console.log(f,"removed",removed);
}
